import EmployeeManager from '../EmployeeManager'
import { Employee } from '../ScheduleGrid'
import { useState } from 'react'

export default function EmployeeManagerExample() {
  const initialEmployees: Employee[] = [
    { id: 'emp1', name: 'Elvira', color: 'hsl(220 90% 56%)' },
    { id: 'emp2', name: 'Lidija', color: 'hsl(142 76% 36%)' },
  ]

  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)

  return (
    <div className="w-80 p-4">
      <EmployeeManager 
        employees={employees}
        onEmployeesChange={setEmployees}
      />
    </div>
  )
}
