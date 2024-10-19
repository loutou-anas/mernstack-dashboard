import { useEffect, useState } from 'react';
import { get } from '../../services/ApiEndPoint';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useSelector } from 'react-redux';

ChartJS.register(ArcElement, Tooltip, Legend);

const SudCompositionSpecifique = () => {
    const [data, setData] = useState(null);
    const [availableMonthsYears, setAvailableMonthsYears] = useState([]);
    const [filteredMonths, setFilteredMonths] = useState([]);
    const [filteredYears, setFilteredYears] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const language = useSelector((state) => state.user.language);

    const labels = {
        pageTitle: language === 'en' ? 'Specific Composition - South Atlantic' : 'Composition Spécifique - Atlantique Sud',
        selectMonth: language === 'en' ? 'Select Month:' : 'Sélectionnez le mois:',
        selectYear: language === 'en' ? 'Select Year:' : 'Sélectionnez l\'année:',
        compositionTitle: language === 'en' ? 'Specific Composition of Total Catches' : 'Composition spécifique des captures Totales',
        loadingMessage: language === 'en' ? 'Loading...' : 'Chargement...',
    };

    useEffect(() => {
        const fetchMonthsYears = async () => {
            try {
                const response = await get('/api/atlantique-sud/available-months-years');
                setAvailableMonthsYears(response.data);
            } catch (error) {
                console.error('Error fetching months/years:', error);
            }
        };

        fetchMonthsYears();
    }, []);

    useEffect(() => {
        if (selectedMonth) {
            const uniqueYears = Array.from(
                new Set(
                    availableMonthsYears
                        .filter(item => item._id.month === parseInt(selectedMonth))
                        .map(item => item._id.year)
                )
            );
            setFilteredYears(uniqueYears);
        } else {
            const uniqueYears = Array.from(
                new Set(availableMonthsYears.map(item => item._id.year))
            );
            setFilteredYears(uniqueYears);
        }
    }, [selectedMonth, availableMonthsYears]);

    useEffect(() => {
        if (selectedYear) {
            const uniqueMonths = Array.from(
                new Set(
                    availableMonthsYears
                        .filter(item => item._id.year === parseInt(selectedYear))
                        .map(item => item._id.month)
                )
            );
            setFilteredMonths(uniqueMonths);
        } else {
            const uniqueMonths = Array.from(
                new Set(availableMonthsYears.map(item => item._id.month))
            );
            setFilteredMonths(uniqueMonths);
        }
    }, [selectedYear, availableMonthsYears]);

    useEffect(() => {
        if (selectedMonth && selectedYear) {
            const fetchData = async () => {
                try {
                    const response = await get('/api/atlantique-sud/composition', { month: selectedMonth, year: selectedYear });
                    setData(response.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [selectedMonth, selectedYear]);

    const generateRandomColor = () => {
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        while (colors.includes(color)) {
            color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        }
        colors.push(color);
        return color;
    };

    const colors = [];

    const totalWeight = data ? data.reduce((sum, item) => sum + item.totalWeight, 0) : 0;
    const pieChartData = {
        labels: data ? data.map(item => item._id) : [],
        datasets: [
            {
                data: data ? data.map(item => ((item.totalWeight / totalWeight) * 100).toFixed(2)) : [],
                backgroundColor: data ? data.map(() => generateRandomColor()) : [],
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                    }
                }
            }
        }
    };

    return (
        <div className="composition-container">
            <h2>{labels.pageTitle}</h2>

            <div className="filter-section">
                <div>
                    <label htmlFor="month">{labels.selectMonth}</label>
                    <select id="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                        <option value="">{language === 'en' ? '--Select Month--' : '--Sélectionnez le mois--'}</option>
                        {filteredMonths.map((month) => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="year">{labels.selectYear}</label>
                    <select id="year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        <option value="">{language === 'en' ? '--Select Year--' : '--Sélectionnez l\'année--'}</option>
                        {filteredYears.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {data ? (
                <div className="composition-content">
                    <div className="chart-container-pie">
                        <h3>{labels.compositionTitle}</h3>
                        <Pie data={pieChartData} options={options} />
                    </div>
                </div>
            ) : (
                <p>{labels.loadingMessage}</p>
            )}

            <div className="description">
                <p>
                    {language === 'en'
                        ? 'The specific composition of catches indicates the proportions of different species in the total catches.'
                        : 'La composition spécifique des captures indique les proportions des différentes espèces dans les captures totales.'
                    }
                </p>
            </div>
        </div>
    );
};

export default SudCompositionSpecifique;
