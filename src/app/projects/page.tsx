'use client';

import { useState, useEffect } from 'react';
import { Github, ExternalLink, Star, GitFork, Code, Sparkles, Clock, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { projectDescriptions } from '@/data/projects';
import { useLanguage } from '@/contexts/LanguageContext';
import ProjectDiscussion from '@/components/ProjectDiscussion';

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
  updated_at: string;
}

export default function ProjectsPage() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  // 从 GitHub API 获取项目
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const username = 'XiaoZi-Li';
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);

        if (!res.ok) {
          setRepos([]);
          return;
        }

        const data = await res.json();
        setRepos(data.filter((repo: GitHubRepo) => !repo.name.includes('.github')));
      } catch (error) {
        console.error('Failed to fetch GitHub repos:', error);
        setRepos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const getProjectInfo = (repoName: string) => {
    return projectDescriptions[repoName] || null;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[var(--glow-violet)] to-[var(--glow-violet)] mb-4 sm:mb-6">
            <Github className="w-6 h-6 sm:w-8 sm:h-8 text-slate-900" />
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">{t('projects.title')}</h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('projects.description')}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted dark:bg-card rounded w-3/4 mb-2" />
                  <div className="flex gap-4">
                    <div className="h-4 bg-muted dark:bg-card rounded w-20" />
                    <div className="h-4 bg-muted dark:bg-card rounded w-16" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted dark:bg-card rounded w-full mb-2" />
                  <div className="h-4 bg-muted dark:bg-card rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : repos.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {repos.map((repo) => {
              const projectInfo = getProjectInfo(repo.name);
              return (
                <Card key={repo.id} className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[color-mix(in_oklab,var(--neon-violet)_20%,transparent)]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl group-hover:text-[var(--neon-violet)] dark:group-hover:text-[var(--neon-violet)] transition-colors">
                            {repo.name}
                          </CardTitle>
                          {projectInfo?.status && (
                            <Badge variant="outline" className="text-xs">
                              {projectInfo.status}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          {repo.language && (
                            <div className="flex items-center gap-1">
                              <Code className="w-4 h-4" />
                              <span>{repo.language}</span>
                            </div>
                          )}
                          {repo.stargazers_count > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              <span>{repo.stargazers_count}</span>
                            </div>
                          )}
                          {repo.forks_count > 0 && (
                            <div className="flex items-center gap-1">
                              <GitFork className="w-4 h-4" />
                              <span>{repo.forks_count}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>
                              {(() => {
                                const locale = t('language') === 'zh-CN' ? 'zh-CN' : t('language') === 'ja-JP' ? 'ja-JP' : 'en-US';
                                return new Date(repo.updated_at).toLocaleDateString(locale);
                              })()}
                            </span>
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
                  <CardContent className="space-y-4">
                    {/* 使用中文描述或原始描述 */}
                    <CardDescription className="text-base line-clamp-2">
                      {projectInfo?.description || repo.description || t('common.noMessages')}
                    </CardDescription>
                    
                    {/* 技术亮点 */}
                    {projectInfo?.highlights && projectInfo.highlights.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-2">
                          <Sparkles className="w-4 h-4 text-[var(--neon-violet)]" />
                          {t('common.more')}
                        </div>
                        <ul className="space-y-1">
                          {projectInfo.highlights.map((highlight, i) => (
                            <li key={i} className="text-sm text-muted-foreground dark:text-muted-foreground flex items-start gap-2">
                              <span className="w-1 h-1 rounded-full bg-[var(--glow-violet)] mt-1.5 flex-shrink-0" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Topics */}
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {repo.topics.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  
                  {/* 项目讨论区 */}
                  <div className="px-6 pb-4">
                    <ProjectDiscussion 
                      projectId={repo.name} 
                      projectName={repo.name} 
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted dark:bg-card flex items-center justify-center">
              <Github className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('projects.noRepos')}</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t('common.search')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
