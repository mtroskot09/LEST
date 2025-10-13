import DateNavigator from '../DateNavigator'
import { useState } from 'react'

export default function DateNavigatorExample() {
  const [date, setDate] = useState(new Date())

  return (
    <div className="p-4">
      <DateNavigator date={date} onDateChange={setDate} />
    </div>
  )
}
