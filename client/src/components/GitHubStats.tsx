
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"

interface GitHubStats {
  totalStars: number
  totalCommits: number
  totalPRs: number
  totalIssues: number
  contributedTo: number
}

export default function GitHubStats() {
  const username = "Ankit Kumar's GitHub Stats";
  
  return (
    <Card className="p-6 bg-background/60 backdrop-blur-lg border-[var(--primary)]/20">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        GitHub Stats
      </h3>

      <div className="mb-5">
        <p className="text-lg text-[var(--light)]/80">{username}</p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-[var(--light)]/90">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
          </svg>
          <div className="flex items-center justify-between w-full">
            <span>Total Stars Earned</span>
            <span className="font-mono font-medium">14</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[var(--light)]/90">
          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
          </svg>
          <div className="flex items-center justify-between w-full">
            <span>Total Commits (2023)</span>
            <span className="font-mono font-medium">84</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[var(--light)]/90">
          <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
          </svg>
          <div className="flex items-center justify-between w-full">
            <span>Total PRs</span>
            <span className="font-mono font-medium">6</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[var(--light)]/90">
          <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M11 15a4 4 0 100-8 4 4 0 000 8zm5-4a5 5 0 11-10 0 5 5 0 0110 0z" clipRule="evenodd"/>
            <path d="M9 11a1 1 0 11-2 0 1 1 0 012 0zm4-1a1 1 0 00-1 1 1 1 0 102 0 1 1 0 00-1-1z"/>
          </svg>
          <div className="flex items-center justify-between w-full">
            <span>Total Issues</span>
            <span className="font-mono font-medium">0</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[var(--light)]/90">
          <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <div className="flex items-center justify-between w-full">
            <span>Contributed To (last year)</span>
            <span className="font-mono font-medium">2</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <div className="border border-[var(--light)]/20 rounded-md px-2 py-1 bg-[var(--dark)]/40">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
              Total Commits: 84
            </Badge>
          </div>
        </div>
        <div className="border border-[var(--light)]/20 rounded-md px-2 py-1 bg-[var(--dark)]/40">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              Total Commits (2025): 14
            </Badge>
          </div>
        </div>
        <div className="border border-[var(--light)]/20 rounded-md px-2 py-1 bg-[var(--dark)]/40">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
              Total PRs: 1
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}
