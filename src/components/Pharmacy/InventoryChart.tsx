import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { InventoryItem } from '@/types'

ChartJS.register(ArcElement, Tooltip, Legend)

const InventoryChart = ({ items }: { items: InventoryItem[] }) => {
  const categories = [...new Set(items.map((item) => item.category))]

  const categoryCounts = categories.map(
    (category) => items.filter((item) => item.category === category).length
  )

  const lowStockCount = items.filter((item) => item.stock < item.threshold).length
  const normalStockCount = items.length - lowStockCount

  const data = {
    labels: ['Low Stock', 'Adequate Stock'],
    datasets: [
      {
        data: [lowStockCount, normalStockCount],
        backgroundColor: ['#EF4444', '#10B981'],
        hoverBackgroundColor: ['#DC2626', '#059669'],
      },
    ],
  }

  const categoryData = {
    labels: categories,
    datasets: [
      {
        data: categoryCounts,
        backgroundColor: ['#3B82F6', '#6366F1', '#EC4899', '#F59E0B', '#10B981'],
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-500">Stock Status</h4>
        <Pie data={data} options={{ radius: 300 }} />
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-500">By Category</h4>
        <Pie data={categoryData} />
      </div>
    </div>
  )
}

export default InventoryChart
