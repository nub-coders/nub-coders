
import { Card } from "./ui/card"

interface GitHubStats {
  totalStars: number
  totalCommits: number
  totalPRs: number
  totalIssues: number
  contributedTo: number
}

export default function GitHubStats() {
  return (
    <Card className="p-6 bg-background/60 backdrop-blur-lg">
      <h3 className="text-xl font-semibold mb-4">GitHub Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between border rounded-lg p-3">
          <span>Total Stars Earned</span>
          <span className="font-mono">14</span>
        </div>
        <div className="flex items-center justify-between border rounded-lg p-3">
          <span>Total Commits</span>
          <span className="font-mono">84</span>
        </div>
        <div className="flex items-center justify-between border rounded-lg p-3">
          <span>Total PRs</span>
          <span className="font-mono">6</span>
        </div>
        <div className="flex items-center justify-between border rounded-lg p-3">
          <span>Total Issues</span>
          <span className="font-mono">0</span>
        </div>
        <div className="col-span-2 flex items-center justify-between border rounded-lg p-3">
          <span>Contributed to</span>
          <span className="font-mono">2</span>
        </div>
      </div>
    </Card>
  )
}
