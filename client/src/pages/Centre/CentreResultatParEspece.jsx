import { useEffect, useState, useMemo } from 'react';
import { get } from '../../services/ApiEndPoint';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useSelector } from 'react-redux';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CentreResultatParEspece = () => {
    const [data, setData] = useState(null);
    const [selectedSpecies, setSelectedSpecies] = useState('');
    const [speciesOptions, setSpeciesOptions] = useState([]);
    const [availableMonthsYears, setAvailableMonthsYears] = useState([]);
    const [filteredMonths, setFilteredMonths] = useState([]);
    const [filteredYears, setFilteredYears] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [maturityData, setMaturityData] = useState(null); // Define maturityData and setMaturityData

    const language = useSelector((state) => state.user.language);

    const labels = {
        pageTitle: language === 'en' ? 'Species Result - Central Atlantic' : 'Résultat par Espèce - Atlantique Centre',
        selectMonth: language === 'en' ? 'Select Month:' : 'Sélectionnez le mois:',
        selectYear: language === 'en' ? 'Select Year:' : 'Sélectionnez l\'année:',
        selectSpecies: language === 'en' ? '--Select Species--' : '--Sélectionnez l\'espèce--',
        sizeStructureTitle: language === 'en' ? 'Size Structure of ' : 'Structure des tailles de ',
        maturityStagesTitle: language === 'en' ? 'Maturity Stages of ' : 'Stades de Maturité de ',
        loadingMessage: language === 'en' ? 'Loading...' : 'Chargement...',
    };

    useEffect(() => {
        const fetchSpeciesOptions = async () => {
            if (selectedMonth && selectedYear) {
                try {
                    const response = await get('/api/atlantique-centre/species-by-month-year', { month: selectedMonth, year: selectedYear });
                    setSpeciesOptions(response.data);
                    if (response.data.length > 0) {
                        setSelectedSpecies(response.data[0]);
                    } else {
                        setSelectedSpecies('');
                    }
                } catch (error) {
                    console.error('Error fetching species options:', error);
                }
            }
        };

        fetchSpeciesOptions();
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        const fetchMonthsYears = async () => {
            try {
                const response = await get('/api/atlantique-centre/available-months-years');
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
        if (selectedSpecies && selectedMonth && selectedYear) {
            const fetchData = async () => {
                try {
                    const response = await get('/api/atlantique-centre/species-result', { species: selectedSpecies, month: selectedMonth, year: selectedYear });
                    setData(response.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [selectedSpecies, selectedMonth, selectedYear]);


    useEffect(() => {
        if (selectedSpecies && selectedMonth && selectedYear) {
            const fetchMaturityData = async () => {
                try {
                    const response = await get(`/api/atlantique-centre/maturity-data`, { species: selectedSpecies, month: selectedMonth, year: selectedYear });
                    setMaturityData(response.data);
                } catch (error) {
                    console.error('Error fetching maturity data:', error);
                }
            };

            fetchMaturityData();
        }
    }, [selectedSpecies, selectedMonth, selectedYear]);

    const barChartData = useMemo(() => {
        if (!data || !data.sizeStructure || !data.counts) return null;

        const relevantSizes = data.sizeStructure.map((size, index) => ({
            size: size,
            count: data.counts[index],
        })).filter(item => item.count > 0);

        const sizes = relevantSizes.map(item => item.size);
        const counts = relevantSizes.map(item => item.count);
        const totalSize = counts.reduce((acc, count) => acc + count, 0);

        return {
            labels: sizes.map(size => size.toString()),
            datasets: [{
                label: `${labels.sizeStructureTitle} ${selectedSpecies}`,
                data: counts.map(count => (count / totalSize) * 100),
                backgroundColor: '#36A2EB',
            }],
        };
    }, [data, selectedSpecies, labels.sizeStructureTitle]);

    const maturityChartData = useMemo(() => {
        if (!maturityData) return null;

        const totalMales = maturityData.filter(sexGroup => sexGroup._id === 'M')
            .reduce((sum, sexGroup) => sum + sexGroup.maturityStages.reduce((acc, stage) => acc + stage.count, 0), 0);

        const totalFemales = maturityData.filter(sexGroup => sexGroup._id === 'F')
            .reduce((sum, sexGroup) => sum + sexGroup.maturityStages.reduce((acc, stage) => acc + stage.count, 0), 0);

        const labels = ['Males', 'Females'];
        const stage1Data = [0, 0];
        const stage2Data = [0, 0];
        const stage3Data = [0, 0];
        const stage4Data = [0, 0];
        const stage5Data = [0, 0];

        maturityData.forEach(sexGroup => {
            sexGroup.maturityStages.forEach(stage => {
                const percentage = stage.count / (sexGroup._id === 'M' ? totalMales : totalFemales) * 100;
                if (sexGroup._id === 'M') {
                    stage1Data[0] = stage.stage === 1 ? percentage : stage1Data[0];
                    stage2Data[0] = stage.stage === 2 ? percentage : stage2Data[0];
                    stage3Data[0] = stage.stage === 3 ? percentage : stage3Data[0];
                    stage4Data[0] = stage.stage === 4 ? percentage : stage4Data[0];
                    stage5Data[0] = stage.stage === 5 ? percentage : stage5Data[0];
                } else if (sexGroup._id === 'F') {
                    stage1Data[1] = stage.stage === 1 ? percentage : stage1Data[1];
                    stage2Data[1] = stage.stage === 2 ? percentage : stage2Data[1];
                    stage3Data[1] = stage.stage === 3 ? percentage : stage3Data[1];
                    stage4Data[1] = stage.stage === 4 ? percentage : stage4Data[1];
                    stage5Data[1] = stage.stage === 5 ? percentage : stage5Data[1];
                }
            });
        });

        return {
            labels,
            datasets: [
                { label: 'Stade 1', data: stage1Data, backgroundColor: 'purple' },
                { label: 'Stade 2', data: stage2Data, backgroundColor: 'yellow' },
                { label: 'Stade 3', data: stage3Data, backgroundColor: 'red' },
                { label: 'Stade 4', data: stage4Data, backgroundColor: 'blue' },
                { label: 'Stade 5', data: stage5Data, backgroundColor: 'green' },
            ],
        };
    }, [maturityData]);

    return (
        <div className="resultat-par-espece-container">
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

            <select value={selectedSpecies} onChange={(e) => setSelectedSpecies(e.target.value)}>
                <option value="">{labels.selectSpecies}</option>
                {speciesOptions.map(species => (
                    <option key={species} value={species}>{species}</option>
                ))}
            </select>

            {data ? (
                <div className="result-content">
                    <div className="chart-container">
                        <h3>{labels.sizeStructureTitle} {selectedSpecies}</h3>
                        {barChartData && (
                            <Bar
                                data={barChartData}
                                options={{
                                    plugins: {
                                        title: { display: true, text: `${labels.sizeStructureTitle} ${selectedSpecies}` },
                                        tooltip: {
                                            callbacks: {
                                                label: function (tooltipItem) {
                                                    return tooltipItem.raw.toFixed(2) + '%';
                                                }
                                            }
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                callback: function (value) {
                                                    return value + '%';
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        )}
                    </div>


                    <div className="chart-container">
                        <h3>{labels.maturityStagesTitle} {selectedSpecies}</h3>
                        {maturityChartData && (
                            <Bar
                                data={maturityChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: { display: true, text: `${labels.maturityStagesTitle} ${selectedSpecies}` },
                                        tooltip: {
                                            callbacks: {
                                                label: function (tooltipItem) {
                                                    const stageLabel = tooltipItem.dataset.label;
                                                    const percentage = tooltipItem.raw.toFixed(2);
                                                    return `${stageLabel}: ${percentage}%`;
                                                }
                                            }
                                        }
                                    },
                                    scales: {
                                        x: { stacked: true },
                                        y: {
                                            stacked: true,
                                            beginAtZero: true,
                                            max: 100,
                                        },
                                    },
                                }}
                            />
                        )}
                    </div>
                </div>
            ) : (
                <p>{labels.loadingMessage}</p>
            )}
        </div>
    );
};

export default CentreResultatParEspece;
