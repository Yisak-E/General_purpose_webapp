import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Line, AreaChart, Area, ComposedChart
} from 'recharts';

// Chart color scheme
export const CHART_COLORS = {
  high: '#ef4444',
  medium: '#eab308',
  low: '#22c55e',
  completed: '#10b981',
  inProgress: '#3b82f6',
  notStarted: '#6b7280',
  coverage: '#8b5cf6',
  blue: '#3b82f6',
  green: '#10b981',
  red: '#ef4444',
  yellow: '#eab308',
  purple: '#8b5cf6',
  gray: '#6b7280'
};

// Custom Tooltip Component
export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Progress Overview Chart
export const ProgressOverview = ({ analytics }) => {
  const progressData = [
    { name: 'Completed', value: analytics.completedPages, color: CHART_COLORS.completed },
    { name: 'In Progress', value: analytics.inProgressPages, color: CHART_COLORS.inProgress },
    { name: 'Not Started', value: analytics.notStartedPages, color: CHART_COLORS.notStarted }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h3 className="text-lg font-semibold mb-4">Study Progress Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={progressData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {progressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {progressData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span>{item.name}</span>
              </div>
              <span className="font-semibold">{item.value} pages</span>
            </div>
          ))}
          <div className="pt-3 border-t">
            <div className="flex justify-between">
              <span>Total Pages:</span>
              <span className="font-semibold">{analytics.totalPages}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Coverage:</span>
              <span className="font-semibold">{analytics.averageCoverage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exam Probability Chart
export const ExamProbabilityChart = ({ analytics }) => {
  const probabilityData = [
    { name: 'High', value: analytics.highPriority, color: CHART_COLORS.high },
    { name: 'Medium', value: analytics.mediumPriority, color: CHART_COLORS.medium },
    { name: 'Low', value: analytics.lowPriority, color: CHART_COLORS.low }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h3 className="text-lg font-semibold mb-4">Exam Probability Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={probabilityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#8884d8">
            {probabilityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Coverage Progress Chart
export const CoverageProgressChart = ({ analytics }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h3 className="text-lg font-semibold mb-4">Coverage Progress Over Time</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={analytics.progressTimeline}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="coverage" stroke={CHART_COLORS.coverage} fill={CHART_COLORS.coverage} fillOpacity={0.3} />
          <Line type="monotone" dataKey="pages" stroke={CHART_COLORS.blue} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Question Types Analysis
export const QuestionTypesAnalysis = ({ analytics }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h3 className="text-lg font-semibold mb-4">Question Types Analysis</h3>
      {analytics.questionTypeData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.questionTypeData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="type" width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill={CHART_COLORS.purple} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No question type data available
        </div>
      )}
    </div>
  );
};

// Chapter Comparison Chart
export const ChapterComparison = ({ data, currentCourse }) => {
  const chapterData = currentCourse?.chapters.map(chapter => {
    const pages = chapter.pages || [];
    const totalCoverage = pages.reduce((sum, page) => sum + (page.coverage || 0), 0);
    const avgCoverage = pages.length > 0 ? Math.round(totalCoverage / pages.length) : 0;
    const highPriority = pages.filter(page => page.examProbability === 'High').length;

    return {
      name: chapter.name.length > 20 ? chapter.name.substring(0, 20) + '...' : chapter.name,
      coverage: avgCoverage,
      highPriority,
      totalPages: pages.length
    };
  }) || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h3 className="text-lg font-semibold mb-4">Chapter Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chapterData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip content={<CustomTooltip />} />
          <Bar yAxisId="left" dataKey="highPriority" fill={CHART_COLORS.red} name="High Priority Pages" />
          <Line yAxisId="right" type="monotone" dataKey="coverage" stroke={CHART_COLORS.blue} name="Avg Coverage %" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// Study Status Chart
export const StudyStatusChart = ({ analytics }) => {
  const statusData = [
    { name: 'Completed', value: analytics.completedStatus, color: CHART_COLORS.completed },
    { name: 'In Progress', value: analytics.inProgressStatus, color: CHART_COLORS.inProgress },
    { name: 'Not Started', value: analytics.notStartedStatus, color: CHART_COLORS.notStarted }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h3 className="text-lg font-semibold mb-4">Study Status Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={statusData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#8884d8">
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Coverage Distribution Chart
export const CoverageDistribution = ({ analytics }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h3 className="text-lg font-semibold mb-4">Coverage Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={analytics.coverageDistribution}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill={CHART_COLORS.green} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Main Analytics Dashboard
export const AnalyticsDashboard = ({ data, selectedCourse, selectedChapter, getCurrentPages, getCurrentChapter, getCurrentCourse }) => {
  const calculateAnalytics = () => {
    const currentPages = getCurrentPages();
    const currentChapter = getCurrentChapter();
    const currentCourse = getCurrentCourse();

    // Basic stats
    const totalPages = currentPages.length;
    const completedPages = currentPages.filter(page => page.coverage >= 100).length;
    const inProgressPages = currentPages.filter(page => page.coverage > 0 && page.coverage < 100).length;
    const notStartedPages = currentPages.filter(page => page.coverage === 0).length;

    // Probability distribution
    const highPriority = currentPages.filter(page => page.examProbability === 'High').length;
    const mediumPriority = currentPages.filter(page => page.examProbability === 'Medium').length;
    const lowPriority = currentPages.filter(page => page.examProbability === 'Low').length;

    // Status distribution
    const completedStatus = currentPages.filter(page => page.studyStatus === 'Completed').length;
    const inProgressStatus = currentPages.filter(page => page.studyStatus === 'In Progress').length;
    const notStartedStatus = currentPages.filter(page => page.studyStatus === 'Not Started').length;

    // Coverage progression
    const totalCoverage = currentPages.reduce((sum, page) => sum + (page.coverage || 0), 0);
    const averageCoverage = totalPages > 0 ? Math.round(totalCoverage / totalPages) : 0;

    // Study progress over time (simulated)
    const progressTimeline = [
      { day: 'Day 1', coverage: Math.min(10, averageCoverage), pages: Math.min(2, completedPages) },
      { day: 'Day 2', coverage: Math.min(25, averageCoverage), pages: Math.min(5, completedPages) },
      { day: 'Day 3', coverage: Math.min(45, averageCoverage), pages: Math.min(9, completedPages) },
      { day: 'Day 4', coverage: Math.min(60, averageCoverage), pages: Math.min(12, completedPages) },
      { day: 'Day 5', coverage: Math.min(75, averageCoverage), pages: Math.min(15, completedPages) },
      { day: 'Day 6', coverage: Math.min(85, averageCoverage), pages: Math.min(17, completedPages) },
      { day: 'Today', coverage: averageCoverage, pages: completedPages }
    ];

    // Page coverage distribution
    const coverageDistribution = [
      { range: '0-20%', count: currentPages.filter(p => p.coverage <= 20).length },
      { range: '21-40%', count: currentPages.filter(p => p.coverage > 20 && p.coverage <= 40).length },
      { range: '41-60%', count: currentPages.filter(p => p.coverage > 40 && p.coverage <= 60).length },
      { range: '61-80%', count: currentPages.filter(p => p.coverage > 60 && p.coverage <= 80).length },
      { range: '81-100%', count: currentPages.filter(p => p.coverage > 80).length }
    ];

    // Question type analysis
    const questionTypes = {};
    currentPages.forEach(page => {
      const types = page.likelyQuestionTypes?.split(',').map(t => t.trim()) || [];
      types.forEach(type => {
        if (type) {
          questionTypes[type] = (questionTypes[type] || 0) + 1;
        }
      });
    });

    const questionTypeData = Object.entries(questionTypes).map(([type, count]) => ({
      type,
      count
    }));

    return {
      totalPages,
      completedPages,
      inProgressPages,
      notStartedPages,
      highPriority,
      mediumPriority,
      lowPriority,
      completedStatus,
      inProgressStatus,
      notStartedStatus,
      averageCoverage,
      totalCoverage,
      progressTimeline,
      coverageDistribution,
      questionTypeData,
      currentChapter,
      currentCourse
    };
  };

  const analytics = calculateAnalytics();

  if (!getCurrentChapter()) {
    return (
      <div className="text-center py-12 text-gray-500">
        Please select a course and chapter to view analytics
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressOverview analytics={analytics} />
        <ExamProbabilityChart analytics={analytics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CoverageProgressChart analytics={analytics} />
        <StudyStatusChart analytics={analytics} />
      </div>

      <QuestionTypesAnalysis analytics={analytics} />
      <CoverageDistribution analytics={analytics} />

      <ChapterComparison
        data={data}
        currentCourse={getCurrentCourse()}
      />
    </div>
  );
};