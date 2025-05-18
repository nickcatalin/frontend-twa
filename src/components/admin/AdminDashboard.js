import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { request } from '../../axios_helper';
import { Toast } from 'primereact/toast';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const [userStats, setUserStats] = useState({
        labels: [],
        data: []
    });
    const [linkStats, setLinkStats] = useState({
        labels: [],
        data: []
    });
    const [ratingDistribution, setRatingDistribution] = useState({
        labels: [],
        data: []
    });
    const [dashboardStats, setDashboardStats] = useState({
        totalUsers: 0,
        totalLinks: 0,
        totalRatings: 0,
        newUsers: 0
    });
    const [roleDistribution, setRoleDistribution] = useState({
        labels: [],
        data: []
    });
    const [topCommentedLinks, setTopCommentedLinks] = useState({
        labels: [],
        data: []
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState(30);
    const toast = React.useRef(null);

    const timeRangeOptions = [
        { label: 'Last 7 Days', value: 7 },
        { label: 'Last 30 Days', value: 30 },
        { label: 'Last 90 Days', value: 90 },
        { label: 'Last Year', value: 365 },
    ];

    useEffect(() => {
        fetchData();
    }, [timeRange]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch dashboard stats
            const statsResponse = await request(
                'GET',
                `/admin/dashboard/stats?days=${timeRange}`
            );

            if (statsResponse && statsResponse.data) {
                setDashboardStats(statsResponse.data);
            }

            // Fetch user growth data
            const userGrowthResponse = await request(
                'GET',
                `/admin/dashboard/user-growth?days=${timeRange}`
            );

            if (userGrowthResponse && userGrowthResponse.data) {
                const growthData = userGrowthResponse.data;
                const dates = Object.keys(growthData).sort();

                setUserStats({
                    labels: dates,
                    data: dates.map(date => growthData[date])
                });
            }

            // Fetch links by domain
            const linksByDomainResponse = await request(
                'GET',
                '/admin/dashboard/links-by-domain'
            );

            if (linksByDomainResponse && linksByDomainResponse.data) {
                const domainData = linksByDomainResponse.data;
                const domains = Object.keys(domainData);

                setLinkStats({
                    labels: domains,
                    data: domains.map(domain => domainData[domain])
                });
            }

            // Fetch rating distribution
            const ratingDistributionResponse = await request(
                'GET',
                '/admin/dashboard/rating-distribution'
            );

            if (ratingDistributionResponse && ratingDistributionResponse.data) {
                const ratingData = ratingDistributionResponse.data;
                setRatingDistribution({
                    labels: ratingData.map(item => `${item.rating} Star`),
                    data: ratingData.map(item => item.count)
                });
            }

            // Fetch role distribution data
            const roleDistributionResponse = await request(
                'GET',
                '/admin/dashboard/role-distribution'
            );

            if (roleDistributionResponse && roleDistributionResponse.data) {
                const roleData = roleDistributionResponse.data;
                const roles = Object.keys(roleData);

                setRoleDistribution({
                    labels: roles,
                    data: roles.map(role => roleData[role])
                });
            }

            // Fetch top commented links
            const topCommentedLinksResponse = await request(
                'GET',
                '/admin/dashboard/top-commented-links?limit=5'
            );

            if (topCommentedLinksResponse && topCommentedLinksResponse.data) {
                const linksData = topCommentedLinksResponse.data;
                const linkTitles = Object.keys(linksData);

                setTopCommentedLinks({
                    labels: linkTitles,
                    data: linkTitles.map(title => linksData[title])
                });
            }

        } catch (error) {
            console.error('Error fetching admin dashboard data:', error);
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to fetch dashboard data. Please try again later.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Chart configurations
    const userChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'User Registration Over Time',
            },
        },
    };

    const userChartData = {
        labels: userStats.labels,
        datasets: [
            {
                label: 'New Users',
                data: userStats.data,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const linkChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Links by Domain',
            },
        },
    };

    const linkChartData = {
        labels: linkStats.labels,
        datasets: [
            {
                label: 'Number of Links',
                data: linkStats.data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const ratingChartData = {
        labels: ratingDistribution.labels,
        datasets: [
            {
                label: 'Rating Distribution',
                data: ratingDistribution.data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const roleChartData = {
        labels: roleDistribution.labels,
        datasets: [
            {
                label: 'Users by Role',
                data: roleDistribution.data,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const topLinksChartOptions = {
        responsive: true,
        indexAxis: 'y',
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Top Commented Links',
            },
        },
    };

    const topLinksChartData = {
        labels: topCommentedLinks.labels,
        datasets: [
            {
                label: 'Comment Count',
                data: topCommentedLinks.data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center p-6 text-gray-500">
            <i className="pi pi-chart-bar text-4xl mb-3"></i>
            <p>No data available</p>
        </div>
    );

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <Toast ref={toast} />
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            <div className="mb-4 flex justify-between items-center">
                <Dropdown
                    value={timeRange}
                    options={timeRangeOptions}
                    onChange={(e) => setTimeRange(e.value)}
                    placeholder="Select Time Range"
                />

                <div className="text-sm">Last updated: {new Date().toLocaleString()}</div>
            </div>

            {/* Stats summary row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="shadow-md bg-blue-50">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-blue-700">Total Users</h3>
                        <p className="text-3xl font-bold">{dashboardStats.totalUsers}</p>
                    </div>
                </Card>

                <Card className="shadow-md bg-green-50">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-green-700">Total Links</h3>
                        <p className="text-3xl font-bold">{dashboardStats.totalLinks}</p>
                    </div>
                </Card>

                <Card className="shadow-md bg-yellow-50">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-yellow-700">Total Ratings</h3>
                        <p className="text-3xl font-bold">{dashboardStats.totalRatings}</p>
                    </div>
                </Card>

                <Card className="shadow-md bg-purple-50">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-purple-700">New Users</h3>
                        <p className="text-3xl font-bold">{dashboardStats.newUsers}</p>
                        <p className="text-xs text-gray-600">in last {timeRange} days</p>
                    </div>
                </Card>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card title="User Growth" className="shadow-md">
                    {loading ? (
                        <p className="text-center p-4">Loading...</p>
                    ) : userStats.labels.length > 0 ? (
                        <Line options={userChartOptions} data={userChartData} />
                    ) : (
                        <EmptyState />
                    )}
                </Card>

                <Card title="Links by Domain" className="shadow-md">
                    {loading ? (
                        <p className="text-center p-4">Loading...</p>
                    ) : linkStats.labels.length > 0 ? (
                        <Bar options={linkChartOptions} data={linkChartData} />
                    ) : (
                        <EmptyState />
                    )}
                </Card>

                <Card title="Rating Distribution" className="shadow-md">
                    {loading ? (
                        <p className="text-center p-4">Loading...</p>
                    ) : ratingDistribution.labels.length > 0 ? (
                        <Pie data={ratingChartData} />
                    ) : (
                        <EmptyState />
                    )}
                </Card>
            </div>

            {/* Second row of charts - new charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card title="User Role Distribution" className="shadow-md">
                    {loading ? (
                        <p className="text-center p-4">Loading...</p>
                    ) : roleDistribution.labels.length > 0 ? (
                        <Doughnut data={roleChartData} />
                    ) : (
                        <EmptyState />
                    )}
                </Card>

                <Card title="Top Commented Links" className="shadow-md">
                    {loading ? (
                        <p className="text-center p-4">Loading...</p>
                    ) : topCommentedLinks.labels.length > 0 ? (
                        <Bar options={topLinksChartOptions} data={topLinksChartData} />
                    ) : (
                        <EmptyState />
                    )}
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard; 