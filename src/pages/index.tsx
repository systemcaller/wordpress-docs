import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';



// 定义你的卡片数据
const ProjectList = [
  {
    title: 'Java 教程',
    description: '从入门到精通，涵盖 Spring Boot, Cloud 等核心技术。',
    link: '/java/intro', // 跳转到 Java 文档首页 (根据你的文件名修改)
    bgColor: '#e74c3c', // 红色背景
  },
  {
    title: 'Python 教程',
    description: '数据分析、爬虫、AI 开发必备语言学习指南。',
    link: '/python/intro', // 跳转到 Python 文档首页
    bgColor: '#3498db', // 蓝色背景
  },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

// 卡片组件
function ProjectCard({ title, description, link, bgColor }) {
  return (
    <div className={clsx('col col--6 margin-bottom--lg')}>
      <div className="card shadow--md" style={{ height: '100%', borderTop: `5px solid ${bgColor}` }}>
        <div className="card__header">
          <Heading as="h3">{title}</Heading>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <Link
            className="button button--secondary button--block"
            to={link}>
            开始学习
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="我的技术文档中心">
      <HomepageHeader />
      <main>
        <div className="container margin-top--xl margin-bottom--xl">
          <div className="row">
            {ProjectList.map((props, idx) => (
              <ProjectCard key={idx} {...props} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
