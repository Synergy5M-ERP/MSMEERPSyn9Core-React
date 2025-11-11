import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function Dashboard() {
  const [chartType, setChartType] = useState('balanceSheet');
  const [timeFrame, setTimeFrame] = useState('weekly');

  // Sample data
  const dataSamples = {
    balanceSheet: {
      weekly: [
        { name: 'Week 1', Assets: 4000, Liabilities: 2400 },
        { name: 'Week 2', Assets: 3000, Liabilities: 1398 },
      ],
      monthly: [
        { name: 'Jan', Assets: 12000, Liabilities: 6000 },
        { name: 'Feb', Assets: 15000, Liabilities: 8000 },
      ],
    },
    profitLoss: {
      weekly: [
        { name: 'Week 1', Profit: 2000, Loss: 500 },
        { name: 'Week 2', Profit: 3000, Loss: 700 },
        { name: 'Week 5', Profit: 9000, Loss: 8600 },
        { name: 'Week 3', Profit: 5760, Loss: 8600 },
        { name: 'Week 4', Profit: 9000, Loss: 3479 },
      ],
      monthly: [
        { name: 'Jan', Profit: 8000, Loss: 2000 },
        { name: 'Feb', Profit: 9000, Loss: 1000 },
      ],
    },
    trialBalance: {
      weekly: [
        { name: 'Week 1', Debits: 8000, Credits: 7500 },
        { name: 'Week 2', Debits: 9000, Credits: 8600 },
        { name: 'Week 3', Debits: 5760, Credits: 8600 },
        { name: 'Week 4', Debits: 9000, Credits: 3479 },
        { name: 'Week 5', Debits: 8778, Credits: 9030 },
      ],
      monthly: [
        { name: 'Jan', Debits: 35000, Credits: 34000 },
        { name: 'Feb', Debits: 37000, Credits: 36000 },
      ],
    },
  };

  const chartData = dataSamples[chartType][timeFrame];

  // Calculate totals for cards
  const totals = {
    balanceSheet: {
      totalAssets: chartData.reduce((sum, item) => sum + (item.Assets || 0), 0),
      totalLiabilities: chartData.reduce((sum, item) => sum + (item.Liabilities || 0), 0),
    },
    profitLoss: {
      totalProfit: chartData.reduce((sum, item) => sum + (item.Profit || 0), 0),
      totalLoss: chartData.reduce((sum, item) => sum + (item.Loss || 0), 0),
    },
    trialBalance: {
      totalDebits: chartData.reduce((sum, item) => sum + (item.Debits || 0), 0),
      totalCredits: chartData.reduce((sum, item) => sum + (item.Credits || 0), 0),
    },
  };

  let bars, cards;
  if (chartType === 'balanceSheet') {
    bars = (
      <>
        <Bar dataKey="Assets" fill="#8884d8" />
        <Bar dataKey="Liabilities" fill="#82ca9d" />
      </>
    );
    cards = (
      <>
        <div className='row'>
          <div className='col-6'>  <Card label="Total Assets  " value={totals.balanceSheet.totalAssets} />
          </div>
          <div className='col-6'> <Card label="Total Liabilities" value={totals.balanceSheet.totalLiabilities} />
          </div>
        </div>
      </>
    );
  } else if (chartType === 'profitLoss') {
    bars = (
      <>
        <Bar dataKey="Profit" fill="#24ec11ff" />
        <Bar dataKey="Loss" fill="#e21313ff" />
      </>
    );
    cards = (
      <>
        <div className='row'>
          <div className='col-6'> <Card label="Total Profit in Lakhs" value={totals.profitLoss.totalProfit} />

          </div>
          <div className='col-6'>     <Card label="Total Loss in Lakhs " value={totals.profitLoss.totalLoss} /></div>
        </div>

      </>
    );
  } else if (chartType === 'trialBalance') {
    bars = (
      <>
        <Bar dataKey="Debits" fill="#8884d8" />
        <Bar dataKey="Credits" fill="#82ca9d" />
      </>
    );
    cards = (
      <>
        <div className='row'>
          <div className='col-6'>   <Card label="Total Debits in Lakhs" value={totals.trialBalance.totalDebits} />
          </div>
          <div className='col-6'>  <Card label="Total Credits in Lakhs" value={totals.trialBalance.totalCredits} />
          </div>
        </div>
      </>
    );
  }

  return (
    <div style={{ padding: 10 }}>
      <h2 style={{ textAlign: 'left' }}>Financial Dashboard</h2>

      {/* Chart type selection */}
      <div style={{ textAlign: 'left' }}>
        <label className='h5 m-2 text-primary'><input type="radio" name="chartType" value="balanceSheet" checked={chartType === 'balanceSheet'} onChange={() => setChartType('balanceSheet')} /> Balance Sheet</label>{' '}
        <label className='h5 m-2 text-primary'   ><input type="radio" name="chartType" value="profitLoss" checked={chartType === 'profitLoss'} onChange={() => setChartType('profitLoss')} /> Profit & Loss</label>{' '}
        <label className='h5 m-2 text-primary'         ><input type="radio" name="chartType" value="trialBalance" checked={chartType === 'trialBalance'} onChange={() => setChartType('trialBalance')} /> Trial Balance</label>
      </div>

      {/* Timeframe selection */}
      <div style={{ marginTop: 10, textAlign: 'left' }}>
        <label className='h5 m-2 text-info'><input type="radio" name="timeFrame" value="weekly" checked={timeFrame === 'weekly'} onChange={() => setTimeFrame('weekly')} /> Weekly</label>{' '}
        <label className='h5 m-2 text-info'><input type="radio" name="timeFrame" value="monthly" checked={timeFrame === 'monthly'} onChange={() => setTimeFrame('monthly')} /> Monthly</label>
      </div>

      {/* Row with chart and cards */}
      <div style={{ display: 'flex', marginTop: 30, gap: 40 }}>
        <div style={{ flex: 2, height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 2 " />
              <XAxis dataKey="name" />
              <YAxis />

              <Tooltip />
              <Legend />
              {bars}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {cards}
        </div>
      </div>
      <div>
        <h3 style={{ textAlign: 'left' }}>Today's Activities</h3>
      </div>
    </div>
  );
}

function Card({ label, value }) {
  const size = 150; // width and height for square shape

  return (
    <div
      style={{
        background: '#e3f2fd',
        width: size,
        height: size,
        padding: 12,
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      <h3
        style={{
          margin: 0,
          color: '#0f1316ff',
          fontSize: 16,
          textAlign: 'center',
        }}
      >
        {label}
      </h3>
      <p
        style={{
          fontSize: 20,
          margin: '6px 0 0',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {value}
      </p>
    </div>
  );
}


export default Dashboard;
