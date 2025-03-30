import { useMeQuery } from '@/services/api'
import InfoCard from '../InfoCard'
import { formatDate } from '@/utils/formatDate'

const ProfileInformation = () => {
  const { data } = useMeQuery()

  const personalInfo = [
    {
      label: 'Full Name',
      value: `${data?.body.data?.firstName || ''} ${data?.body.data?.lastName || ''}`,
    },
    { label: 'Email Address', value: data?.body.data?.email || '' },
    { label: 'Gender', value: 'Male' },
    { label: 'Phone Number', value: `+91 - ${data?.body.data?.phoneNumber || ''}` },
    { label: 'Role', value: String(data?.body.data?.role) || '' },
  ]

  const addressInfo = [
    { label: 'Village', value: data?.body.data?.Address?.street || '' },
    { label: 'Town/City', value: data?.body.data?.Address?.city || '' },
    { label: 'State', value: data?.body.data?.Address?.state || '' },
    { label: 'Country', value: data?.body.data?.Address?.country || '' },
    { label: 'Postal Code', value: data?.body.data?.Address?.zipCode || '' },
    { label: 'User since', value: formatDate(data?.body.data?.createdAt) || '' },
  ]

  const handleEditPersonal = () => {
    console.log('Edit personal information')
  }

  const handleEditAddress = () => {
    console.log('Edit address information')
  }

  return (
    <div className="mx-auto max-w-6xl">
      <InfoCard title="Personal Information" fields={personalInfo} onEdit={handleEditPersonal} />

      <InfoCard title="Address" fields={addressInfo} onEdit={handleEditAddress} />
    </div>
  )
}

export default ProfileInformation
