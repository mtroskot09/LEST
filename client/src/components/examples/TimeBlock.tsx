import TimeBlock, { TimeBlockData } from '../TimeBlock'

export default function TimeBlockExample() {
  const block: TimeBlockData = {
    id: '1',
    employeeId: 'emp1',
    startTime: '13:00',
    endTime: '14:30',
    task: 'Customer Appointment',
  }

  return (
    <div className="w-64 p-4">
      <TimeBlock 
        block={block} 
        color="hsl(220 90% 56%)"
        onDelete={() => console.log('Delete clicked')}
      />
    </div>
  )
}
