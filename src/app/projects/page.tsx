import { Github, ExternalLink, Star, GitFork, Code } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// GitHub 项目数据类型
interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
}

// 从GitHub API获取项目
async function getGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    // 你的GitHub用户名
    const username = 'XiaoZi-Li';
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      next: { revalidate: 3600 } // 每小时重新验证一次
    });
    
    if (!res.ok) {
      return [];
    }
    
    const repos = await res.json();
    return repos.filter((repo: GitHubRepo) => !repo.name.includes('.github'));
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const repos = await getGitHubRepos();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 mb-6">
            <Github className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">我的项目</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            在GitHub上开源的项目和代码作品
          </p>
        </div>

        {/* Projects Grid */}
        {repos.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {repos.map((repo) => (
              <Card key={repo.id} className="group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {repo.name}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        {repo.language && (
                          <div className="flex items-center gap-1">
                            <Code className="w-4 h-4" />
                            <span>{repo.language}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          <span>{repo.stargazers_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="w-4 h-4" />
                          <span>{repo.forks_count}</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-accent transition-colors"
                      aria-label="View on GitHub"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base line-clamp-2">
                    {repo.description || '暂无描述'}
                  </CardDescription>
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <Badge key={topic} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Github className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">配置GitHub用户名</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              暂无GitHub项目，正在努力开发中...
            </p>
          </div>
        )}

        {/* Featured Projects Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">重点推荐</h2>
          <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">RDK X5 具身智能系统</CardTitle>
              <CardDescription className="text-violet-100">
                基于RDK X5开发板和dora-rs框架的具身智能系统
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base text-violet-50">
                正在开发基于RDK X5开发板的具身智能系统,使用dora-rs数据流框架实现机器人的感知、决策和控制一体化。项目涵盖:
              </p>
              <ul className="list-disc list-inside space-y-2 text-violet-50">
                <li>视觉感知与目标检测</li>
                <li>运动规划与控制</li>
                <li>语音交互系统</li>
                <li>多传感器融合</li>
              </ul>
              <div className="flex gap-3 pt-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-violet-600 font-medium hover:bg-violet-50 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  查看项目
                </a>
                <a
                  href="/robotics"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-white text-white font-medium hover:bg-white/10 transition-colors"
                >
                  了解更多
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
