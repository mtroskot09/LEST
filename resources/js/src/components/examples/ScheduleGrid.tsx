import ScheduleGrid, { Employee } from '../ScheduleGrid'
import { TimeBlockData } from '../TimeBlock'
import { useState } from 'react'

export default function ScheduleGridExample() {
  const employees: Employee[] = [
    { id: 'emp1', name: 'Elvira', color: 'hsl(220 90% 56%)' },
    { id: 'emp2', name: 'Lidija', color: 'hsl(142 76% 36%)' },
  ]

  const initialBlocks: TimeBlockData[] = [
    {
      id: 'block1',
      employeeId: 'emp1',
      startTime: '13:00',
      endTime: '14:30',
      task: 'Client Meeting',
    },
    {
      id: 'block2',
      employeeId: 'emp1',
      startTime: '16:00',
      endTime: '17:00',
      task: 'Team Sync',
    },
  ]

  const [blocks, setBlocks] = useState<TimeBlockData[]>(initialBlocks)

  return (
    <div className="h-screen">
      <ScheduleGrid 
        employees={employees}
        blocks={blocks}
        onBlocksChange={setBlocks}
        date={new Date()}
      />
    </div>
  )
}
