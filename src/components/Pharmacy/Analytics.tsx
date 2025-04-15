import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import inventoryData from '@/utils/inventoryData'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const Analytics = () => {
  // Sample sales data (in a real app, this would come from an API)
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: '2023 Sales',
        data: [12000, 19000, 15000, 18000, 21000, 23000, 25000, 22000, 20000, 18000, 16000, 22000],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.1,
        fill: true,
      },
      {
        label: '2022 Sales',
        data: [10000, 12000, 13000, 15000, 17000, 19000, 21000, 20000, 18000, 16000, 14000, 18000],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.1,
        borderDash: [5, 5],
        fill: true,
      },
    ],
  }

  const categorySales = {
    labels: [
      'Pain Relief',
      'Antibiotics',
      'Blood Pressure',
      'Cholesterol',
      'Diabetes',
      'Acid Reducer',
      'Allergy',
    ],
    datasets: [
      {
        label: 'Sales by Category',
        data: [45000, 28000, 32000, 29000, 21000, 25000, 18000],
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Pharmacy Sales Analytics',
      },
    },
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Sales Analytics & Forecasting</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Monthly Sales Trend</h3>
          <Line data={salesData} options={options} />
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Sales by Category</h3>
          <Bar data={categorySales} options={options} />
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Demand Forecast</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {inventoryData.slice(0, 6).map((item) => (
            <div key={item.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.brand}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    item.stock < item.threshold
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {item.stock < item.threshold ? 'Low Stock' : 'Adequate'}
                </span>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-sm">
                  <span>Current Stock:</span>
                  <span>
                    {item.stock} {item.unit}
                  </span>
                </div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Reorder Threshold:</span>
                  <span>
                    {item.threshold} {item.unit}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Projected Demand (30 days):</span>
                  <span>
                    {Math.round(item.stock * 0.3)} {item.unit}
                  </span>
                </div>
              </div>
              <button className="mt-3 w-full rounded-lg bg-indigo-50 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100">
                Adjust Reorder Level
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Analytics
