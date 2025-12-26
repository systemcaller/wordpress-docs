---
sidebar_position: 3
title: Java 你好33
---

# 搭建 cloudflare + wordpress44

1. 域名注册
2. 域名托管给 cloudflare
3. 购买腾讯云 wordpress 应用服务器
4. 域名解析到公网 IP
5. 进入 wordpress 后台设置中，修改站点地址为域名地址 https://systemcaller.online
6. 修改 wp-config.cf 配置文件
   1. 强制 https
   2. 数据库账号密码
7. 登录宝塔后台，
   1. 宝塔的初始域名 wordpress.local (可以删除) , 将站点绑定域名 systemcaller.online
   2. cloudflare 获取服务端证书（用这个是免费），再配置到宝塔 Nginx 的 SSL 中
   3. 根目录的文件权限设置为用户组 www 而不是 root
   4. 子目录绑定 ，可以通过 url 直接访问资源

遇到的问题：

1. 无限重定向问题
2. 域名访问不到问题
3. 主题和插件域名更新问题
4. 更新插件需要权限问题，修改项目根目录内文件的权限，不要是 root

---

> **📝 摘要**：  
> 本文记录了一次典型的“脏迁移”实战案例。我将一个 WordPress 站点从托管型主机（Hostinger）迁移到了自主管理的 VPS（腾讯云 + 宝塔面板）。  
> 在这个过程中，我们遭遇了  **DNS 解析残留、SSL 重定向死循环、文件权限锁死、数据库硬编码残留**  以及  **Nginx 代理机制困惑**  等一系列经典问题。
>
> 本文不仅提供“保姆级”的解决方案，更致力于讲透每一行配置背后的**技术原理**。

---

## 第一章：流量的入口 —— DNS 与 Cloudflare

迁移的第一步往往存在认知误区：**我们需要的是修改“路标”，而不是把“房子”搬走。**

### 1.1 域名迁移 vs DNS 接入

很多新手会混淆  **Domain Transfer（域名转移）**  和  **Change Nameservers（修改 NS 记录）**。

- **误区**：认为必须把域名管理权转入 Cloudflare，这需要付费和漫长等待。
- **正解**：保持 Hostinger 作为注册商（负责收年费），仅将  **Nameservers (NS)**  修改为 Cloudflare 提供的地址。这样 Cloudflare 就能接管域名的解析权和 CDN 功能，零成本且即时生效。

### 1.2 DNS 配置：直连与代理

配置 DNS 方式如下，有类型、名称、内容 3 个部分。

|                    |                         |                                                                     |
| ------------------ | ----------------------- | ------------------------------------------------------------------- |
| 组成部分           | 你的配置值              | 含义                                                                |
| **类型 (Type)**    | **A**                   | 代表  **Address (地址)**。它是用来指定 IPv4 地址的记录。            |
| **名称 (Name)**    | **systemcaller.online** | 你要解析的域名（在后台通常填  @  代表根域名，或者直接填完整域名）。 |
| **内容 (Content)** | **101.00.00.70**        | 你的服务器在互联网上的“门牌号”（IP 地址）。                         |

当用户在浏览器输入  systemcaller.online  时，DNS 会告诉浏览器：“去访问  101.00.00.70  这个服务器。

这里的配置会有一个特殊的开关，叫做  **Proxy Status (代理状态)**，通常是一个“小云朵”图标。

接入 Cloudflare 后，最重要的就是 DNS 记录旁边的“小云朵”状态。

|              |      |        |                              |                                                        |
| ------------ | ---- | ------ | ---------------------------- | ------------------------------------------------------ |
| 模式         | 图标 | 状态   | 技术含义                     | 适用场景                                               |
| **Proxied**  | ☁️🧡 | 已代理 | 流量经过 Cloudflare CDN 中转 | **生产环境推荐**。隐藏源站 IP，抗 DDoS，享用免费 SSL。 |
| **DNS Only** | ☁️🤍 | 仅 DNS | 流量直接打到腾讯云 IP        | **调试期/特殊服务**。如 SSH 连接、FTP 服务。           |

> **⚠️ 避坑指南：IPv6 幽灵记录**  
> 在迁移初期，网站频繁出现无法访问或跳回旧主机页面的情况。  
> **原因**：Hostinger 曾分配了 IPv6 地址（AAAA 记录）。迁移时我只改了 IPv4（A 记录）。由于现代网络优先尝试 IPv6，流量依然被导向了已停机的旧服务器。  
> **解决**：务必彻底删除旧主机残留的  **AAAA 记录**。

### 1.3 刷新本地“导航地图”

即使云端配置正确，本地电脑可能依然访问旧 IP。这是因为操作系统缓存了 DNS 结果（TTL）。

- **Windows**: ipconfig /flushdns
- **Mac**: sudo killall -HUP mDNSResponder

---

## 第二章：SSL 加密链路 —— “重定向次数过多”的死结

1. 将完整的站点根目录文件全部迁移到腾讯云对应目录下。
2. 数据库迁移，建议是创建一个和原来一样的 database，再导入数据
3. 修改 wp-config.php 配置文件，将数据库连接指向新创建的 database。

```php
/** 数据库名称 */
define( 'DB_NAME', '这里填你腾讯云新建的数据库名' );

/** 数据库用户名 */
define( 'DB_USER', '这里填你腾讯云的数据库用户名' );

/** 数据库密码 */
define( 'DB_PASSWORD', '这里填你腾讯云的数据库密码' );

/** 数据库主机 */
// 注意：腾讯云如果是在本地，通常是 'localhost' 或 '127.0.0.1'
define( 'DB_HOST', 'localhost' );
// 强制 HTTPS 和域名
define( 'WP_HOME', 'https://systemcaller.online' );
define( 'WP_SITEURL', 'https://systemcaller.online' );
HTTPS if (isset($_SERVER['HTTP_CF_VISITOR']) && strpos($_SERVER['HTTP_CF_VISITOR'], 'https') !== false) { $_SERVER['HTTPS'] = 'on'; }

```

### 2.1 问题现象

这是本次迁移中最棘手的问题：能够访问后台  /wp-admin，但访问首页时，浏览器报错：**ERR_TOO_MANY_REDIRECTS**（将您重定向的次数过多）。

### 2.2 深度原因分析：加密的“欺骗”

这个问题是  **WordPress 和 Cloudflare 配合时最经典的问题**，叫做  **“重定向循环”**。**为什么会死循环？**  这是一个由“沟通误会”引发的灾难。

1. **浏览器 -> Cloudflare**：用户发起 HTTPS 请求（加密）。
2. **Cloudflare -> 源站**：Cloudflare 默认（Flexible 模式）使用 HTTP 请求源站。
3. **源站 (Nginx)**：发现请求是 HTTP，为了安全，返回  301 Redirect  强制跳转到 HTTPS。
4. **死循环**：Cloudflare 收到跳转指令，再次以 HTTP 请求源站... 无限套娃。

### 2.3 解决方案：端到端加密（Full Strict）

我们需要建立双重保险机制，让 Cloudflare 和源站之间也通过 HTTPS 对话。

**步骤一：Cloudflare 侧设置**

- SSL/TLS 模式设置为  **Full (Strict)**。强制 Cloudflare 使用 HTTPS 协议连接你的源站，并验证源站证书的有效性。

**步骤二：服务器（宝塔）侧设置：**

- **部署证书**：在宝塔站点设置中，部署 SSL 证书。推荐使用  **Cloudflare Origin CA**（源服务器证书），有效期长达 15 年，且专为配合 Cloudflare 设计。
- **绑定域名**： 在宝塔站点设置中，为根目录绑定 systemcaller.online 和 www.systemcaller.online 两个域名，这一步完成后，Nginx 就知道：凡是访问 systemcaller.online 的，都去这个根目录拿文件。

### 2.4 扩展

整个链路涉及到两个 SSL 证书，第一个证书是**Cloudflare**的边缘证书 ，第二个证书是**宝塔服务器 Nginx**的源服务器证书。

#### . 边缘证书 (Edge Certificate)

- **位置：** **访客 &lt;---> Cloudflare**
- **含义：**  这是给“门卫”穿的制服。
- **作用：**  当你在浏览器里输入  https://systemcaller.online  时，浏览器首先看到的是 Cloudflare。Cloudflare 必须出示这张证书，证明“我是合法的，这里很安全”。
- **特点：**  这张证书通常由 Cloudflare **自动免费颁发并管理**（通用 SSL）。你不需要操心，它会自动续期。浏览器上的小锁头，锁的就是这一段。

#### 源服务器证书 (Origin Certificate)

- **位置：** **Cloudflare &lt;---> 你的腾讯云服务器（源站）**
- **含义：**  这是给“仓库管理员”穿的制服。
- **作用：**  当 Cloudflare 觉得访客没问题，要把请求转发给你的腾讯云时，Cloudflare 需要确认你的服务器是安全的，数据传输过程也是加密的。这时候，你的宝塔面板里配置的证书（无论是 Let's Encrypt 还是 Cloudflare Origin CA）就起作用了。
- **特点：**  这是你在宝塔面板里配置的那个证书。只有 Cloudflare 看得到它，普通的访客是直接看不到的。

想象你在给住在皇宫（你的服务器）的皇帝送一封机密信件。**第一段路（你 -> 中转站）：** 你把信交给  **Cloudflare 快递员**。为了安全，Cloudflare 给你一个**“红色保险箱”（Cloudflare 的证书）把信锁起来。你在浏览器里看到的那个小锁，其实就是这个 “红色保险箱（边缘证书）” 。
**中转站（Cloudflare 内部）：** Cloudflare 收到信后，用红钥匙打开箱子，把信取出来进行检查（防火墙过滤、缓存加速）。
**第二段路（Cloudflare -> 皇宫）：** 现在 Cloudflare 要把信送到你的  **腾讯云服务器（皇宫）**。为了路上不被劫匪（黑客）偷看，Cloudflare 必须把信再装进**另一个“蓝色保险箱（源服务器证书）”**（宝塔/腾讯云的证书）里。当信到达腾讯云时，服务器用蓝钥匙打开箱子，读取内容。
**红色箱子**  是 Cloudflare 给访客看的。
**蓝色箱子**  是你的服务器给 Cloudflare 看的。
**访客永远只看得到红色箱子，永远不知道蓝色箱子的存在。\*\*  红色箱子是 Cloudflare 自动生成的，不需要我们去配置，也配置不了。

如果你是想实现“访问同一个域名，根据情况去不同的目录”，或者“测试新网站”，有以下几种替代方案：

- **方案 A：使用子域名（推荐）**
  - 正式站：www.systemcaller.online -> 绑定到站点 A
  - 测试站：dev.systemcaller.online -> 绑定到站点 B
  - 这是最标准、互不干扰的做法。
- **方案 B：使用子目录**
  - 只有一个站点  systemcaller.online。
  - 在根目录下建一个文件夹叫  test。
  - 访问  systemcaller.online/test  就可以看到测试内容。
- **方案 C：使用不同端口（非标准）**
  - 站点 A：systemcaller.online (默认 80/443 端口)
  - 站点 B：systemcaller.online  但在宝塔里把端口改成  **8080**。
  - 访问：只有输入  systemcaller.online:8080  才能访问站点 B。

## 第三章：权限与文件归属

### 3.1 问题现象

在 WordPress 后台点击更新插件或上传图片时，弹出窗口要求输入  **主机名、FTP 用户名、密码**。

### 3.2 深度原因分析：Linux 用户权限模型

- **迁移方式**：你是通过 SSH 使用  root  账号解压备份文件的。
- **文件归属**：在 Linux 中，谁创建（解压）了文件，文件就归谁。此时文件所有者是  root。
- **运行身份**：Nginx 和 PHP 进程通常以降权的普通用户身份（如  www）运行，以保安全。
- **冲突**：当  www  用户（WordPress）试图修改  root  用户的文件时，Linux 内核会直接拒绝。WordPress 碰壁后，误以为是服务器配置问题，于是试图通过 FTP 协议来绕过权限限制。

### 3.3 解决方案

**不要填 FTP 密码，而是交还文件控制权。**

1. **修改所有者 (Chown)**：  
   在宝塔文件管理中，将网站根目录的所有者递归修改为  **www** (用户组也为  www)。
2. **配置文件兜底**：  
   在  wp-config.php  中添加：define( 'FS_METHOD', 'direct' );

---

## 第四章：数据清洗 —— 彻底清除旧域名残留

文件搬过来了，但数据库里还“硬编码”着旧域名（systemcaller.com）和旧 IP（101.32...）。这导致图片无法显示、Elementor 样式错乱。

迁移后，虽然主页能开，但出现以下问题：

1. Elementor 样式丢失，字体报错。
2. 图片不显示，控制台报错指向旧 IP   或旧域名  systemcaller.com。

### 4.1 解决方案：数据库手术

**警告**：WordPress 数据包含序列化字符串，直接使用 SQL 语句  UPDATE  会破坏数据结构。必须使用插件。

利用  **Better Search Replace**  插件执行以下替换：

1. **IP 替换**：http://101.00.00.70 -> https://systemcaller.online
2. **域名替换**：systemcaller.com -> systemcaller.online
3. **端口修复**：systemcaller.online:80 -> systemcaller.online  
   (注：这是 HTTPS 环境下混入端口号导致的混合内容报错，必须修复)

### 4.2 Elementor 专属修复

Elementor 为了性能会生成静态 CSS 文件，这些文件里写死了旧域名。

- **路径**：Elementor -> 工具 -> 常规 -> **重新生成 CSS 和 Data**。
- **作用**：强制删除旧 CSS 缓存，触发系统按新域名重新编译样式表。

---

## 第五章：底层架构延伸 —— Nginx、PHP 与 Java 的区别

### 5.1 用户提问

> “为什么 Java 项目需要 Nginx 转发到 8080 端口，而 PHP 却不需要转发，直接内部处理？”

### 5.2 架构原理深度解析

这涉及到 Web 服务器架构的两种流派：**反向代理 (Reverse Proxy)**  与  **网关接口 (Gateway Interface)**。

#### 场景 A：Java (Tomcat/Spring Boot) —— “独立应用模式”

- **架构**：Nginx &lt;--> HTTP 协议 &lt;--> Tomcat(Java)
- **原理**：Java 应用本身就是一个完整的 Web 服务器。它自己监听端口（如 8080），自己解析 HTTP 报文。
- **Nginx 的作用**：仅仅是一个“二传手”。它把请求原封不动地（或修改 Header 后）**转发**给 Java。
- **配置特征**：proxy_pass http://127.0.0.1:8080;

#### 场景 B：PHP (PHP-FPM) —— “进程管理器模式”

- **架构**：Nginx &lt;--> FastCGI 协议 &lt;--> PHP-FPM
- **原理**：PHP 只是一个脚本解释器，它不懂 HTTP，也不会监听网络端口。它需要一个管理器（PHP-FPM）来维护进程池。
- **Nginx 的作用**：**翻译官**。
  1. Nginx 接收 HTTP 请求。
  2. Nginx 做  **SSL 卸载**（解密 HTTPS 为明文）。
  3. Nginx 将 HTTP 报文转换为  **FastCGI 二进制协议**。
  4. 通过 Unix Socket 或 9000 端口传给 PHP-FPM 执行。
- **配置特征**：fastcgi_pass 127.0.0.1:9000;

### 5.3 SSL 终结 (SSL Termination)

在你的 WordPress 架构中，443 端口的 HTTPS 流量到达 Nginx 后：

1. Nginx 使用证书私钥解密数据。
2. **数据变为明文**。
3. Nginx 直接将明文数据通过 FastCGI 传给 PHP。
4. **结论**：根本不需要“转发到 80 端口”。443 端口不仅是入口，也是解密工厂，解密后直接在服务器内部消化处理了。

---

## 总结

此次迁移不仅是一次数据的搬运，更是一次对  **Web 基础设施**  的深度扫描。

成功解决了：

1. **DNS**：清理了 Hostinger 残留的 IPv6 记录，理解了 Cloudflare 的代理机制。
2. **HTTPS**：通过 Full Strict 模式和宝塔证书，构建了零信任的安全链路。  双证书架构是解决重定向循环的终极方案。
3. **系统权限**：纠正了 Linux 文件所有权，恢复了 WordPress 的读写能力。
4. **数据一致性**：清洗了数据库中的旧资产链接，修复了前端显示。
