import EmployeeAvatar from '../EmployeeAvatar'

export default function EmployeeAvatarExample() {
  return (
    <div className="flex gap-4 p-4">
      <EmployeeAvatar name="Elvira" color="hsl(220 90% 56%)" />
      <EmployeeAvatar name="Lidija" color="hsl(142 76% 36%)" />
    </div>
  )
}
