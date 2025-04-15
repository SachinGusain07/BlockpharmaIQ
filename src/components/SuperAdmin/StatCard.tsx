import React from 'react'
import { Card } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, className = '' }) => {
  return (
    <Card className={`flex items-center ${className}`}>
      <div className="mr-4 rounded-full bg-blue-100 p-3">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </p>
        )}
      </div>
    </Card>
  )
}

export default StatCard
