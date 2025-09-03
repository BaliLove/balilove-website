import TeamGrid from '@/app/components/TeamGrid'
import { sampleTeamMembers } from '../sampleData'

export default function Page() {
  return (
    <div>
      <h1 className="text-center text-2xl py-4">TeamGrid Test</h1>
      <div className="container mx-auto p-4">
        <TeamGrid teamMembers={sampleTeamMembers as any} />
      </div>
    </div>
  )
}
