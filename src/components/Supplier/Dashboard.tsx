import { motion } from 'framer-motion'

function Dashboard() {
  return (
    <div className="flex">
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Total Orders', value: '1,254', change: '+12.5%', up: true },
                { title: 'Pending Orders', value: '42', change: '-3.2%', up: false },
                { title: 'Low Stock Items', value: '17', change: '+5.1%', up: true },
                { title: 'Revenue', value: '$42,580', change: '+8.3%', up: true },
              ].map((card, index) => (
                <motion.div
                  key={card.title}
                  className="rounded-lg bg-white p-4 shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                  <div className="mt-2 flex items-center">
                    <span className="text-2xl font-bold">{card.value}</span>
                    <span className={`ml-2 text-sm ${card.up ? 'text-green-500' : 'text-red-500'}`}>
                      {card.change}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-1">
              <motion.div
                className="rounded-lg bg-white shadow lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                  <h2 className="text-lg font-medium">Recent Orders</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Order ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Pharmacy
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {[
                        {
                          id: 'ORD-7829',
                          pharmacy: 'MedLife Pharmacy',
                          status: 'Delivered',
                          date: 'Apr 05, 2025',
                          amount: '$2,456',
                        },
                        {
                          id: 'ORD-7830',
                          pharmacy: 'City Drugs',
                          status: 'Processing',
                          date: 'Apr 05, 2025',
                          amount: '$1,893',
                        },
                        {
                          id: 'ORD-7831',
                          pharmacy: 'HealthPlus',
                          status: 'Shipped',
                          date: 'Apr 04, 2025',
                          amount: '$3,752',
                        },
                        {
                          id: 'ORD-7832',
                          pharmacy: 'QuickMeds',
                          status: 'Processing',
                          date: 'Apr 04, 2025',
                          amount: '$954',
                        },
                        {
                          id: 'ORD-7833',
                          pharmacy: 'Family Pharma',
                          status: 'Pending',
                          date: 'Apr 03, 2025',
                          amount: '$2,108',
                        },
                      ].map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-blue-600">{order.id}</td>
                          <td className="px-4 py-3 text-sm">{order.pharmacy}</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                order.status === 'Delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'Processing'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : order.status === 'Shipped'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{order.date}</td>
                          <td className="px-4 py-3 text-sm font-medium">{order.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
