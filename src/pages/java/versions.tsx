import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

// ==========================================
// 1. 这里定义你的版本数据 (模拟 Spring 官网的数据结构)
// ==========================================
const versions = [
    {
        name: '3.0.0-SNAPSHOT',
        status: 'SNAPSHOT', // 标签文字
        statusColor: 'primary', // 颜色: primary(蓝), success(绿), warning(黄), danger(红)
        link: '/java/next/intro', // 跳转链接
        apiLink: '#', // API 文档链接(如果有)
    },
    {
        name: '2.0.1',
        status: 'CURRENT',
        statusColor: 'success',
        link: '/java/intro', // 对应你设置的 routeBasePath
        apiLink: '#',
    },
    {
        name: '1.0.5',
        status: 'GA',
        statusColor: 'danger',
        link: '/java/1.0/intro',
        apiLink: '#',
    },
];

export default function VersionPage(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();

    return (
        <Layout title="Java Versions" description="Java Document Versions">
            <div className="container margin-vert--xl">

                {/* 页面标题 */}
                <div className="row">
                    <div className="col col--10 col--offset-1">
                        <Heading as="h1">Java 教程文档</Heading>
                        <p>每个项目都有其独立的版本发布周期。以下是当前维护的版本列表。</p>

                        {/* 模仿 Spring 的表格样式 */}
                        <div className="card margin-top--lg">
                            <div className="card__body" style={{ padding: 0 }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', display: 'table' }}>
                                    <thead style={{
                                        backgroundColor: 'var(--ifm-color-emphasis-100)',
                                        borderBottom: '1px solid var(--ifm-color-emphasis-300)'
                                    }}>
                                        <tr>
                                            <th style={{ padding: '16px', fontWeight: 'bold', border: 'none' }}>Version</th>
                                            <th style={{ padding: '16px', fontWeight: 'bold', border: 'none' }}>Status</th>
                                            <th style={{ padding: '16px', fontWeight: 'bold', border: 'none' }}>Documentation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {versions.map((version, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #eaecef' }}>
                                                {/* 版本号 */}
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>
                                                    {version.name}
                                                </td>

                                                {/* 状态标签 */}
                                                <td style={{ padding: '16px' }}>
                                                    <span className={`badge badge--${version.statusColor}`}>
                                                        {version.status}
                                                    </span>
                                                </td>

                                                {/* 链接 */}
                                                <td style={{ padding: '16px' }}>
                                                    <Link to={version.link} style={{ marginRight: '15px' }}>
                                                        Reference Doc.
                                                    </Link>
                                                    {version.apiLink !== '#' && (
                                                        <Link to={version.apiLink}>API Doc.</Link>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}