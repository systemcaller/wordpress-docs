---
sidebar_position: 1
sidebar_label: java-md-sidebar_label
---

# java-md-sidebar_label-标题 v-2.0

Let's discover **java in less than 5 minutes**.

# 简介

相信你一定遇到过这样的问题，为什么代码在测试环境上跑的起来，一上生产环境就出现问题。这通常是环境配置差异导致，然后就是花费大量时间去找哪里出现了环境不一致的情况。为了解决这个巨大的痛点，伟大的程序员创造了 **Dokcer** 。

**Docker** 是一个开源的应用容器引擎，它可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，甚至是云平台上。

**Docker 的优势**

- **快速部署：** Docker 容器的启动速度非常快，可以大大缩短应用程序的部署时间。
- **可移植性：** Docker 容器可以在任何支持 Docker 的平台上运行，而无需担心环境差异。
- **轻量级：** Docker 容器共享主机的内核，因此比传统的虚拟机更轻量级。
- **隔离性：** 每个 Docker 容器都是相互隔离的，可以确保应用程序的安全性。
- **高效利用资源：** Docker 可以高效地利用系统资源，提高服务器的利用率。

  **Docker 的核心概念**

- **镜像（Image）：** Docker 镜像是一个只读的模板，包含了运行容器所需的所有内容，包括代码、运行时、系统工具、系统库等等。
- **容器（Container）：** Docker 容器是 Docker 镜像的一个运行实例。您可以创建、启动、停止、移动、删除一个容器。
- **仓库（Repository）：** Docker 仓库用来保存 Docker 镜像。Docker Hub 是一个公共的 Docker 仓库，用户可以在上面查找和分享镜像。

  **Docker 的工作原理**

1. **用户创建 Dockerfile：** Dockerfile 是一个文本文件，里面包含了构建镜像的所有命令。
2. **构建镜像：** Docker 引擎根据 Dockerfile 中的指令一步一步构建镜像。
3. **运行容器：** 用户可以使用 docker run 命令从镜像创建一个容器并运行。

**Docker 的应用场景**

- **微服务架构：** Docker 非常适合构建微服务架构，每个微服务都可以打包成一个独立的容器。
- **持续集成和持续部署（CI/CD）：** Docker 可以加速 CI/CD 流程，提高开发效率。
- **应用程序交付：** Docker 可以将应用程序及其依赖打包成一个容器，方便部署和分发。
- **云原生应用：** Docker 是云原生应用的基础，可以帮助开发者构建云原生应用程序。

在实际的企业级开发中，将每个项目容器化，每次发布前都把项目打包成一个镜像，上传镜像到公司内网的私有镜像仓库中，上线时只需要启动对应的镜像即可。不需要担心环境问题，因为项目所以依赖的环境都已经在镜像里了。配合 Jenkins 可以把这些做成流水线自动化发布。

# 安装

```sh
# 添加docker的官方yum仓库
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装docekr，服务端，客户端，运行环境
sudo yum install -y docker-ce docker-ce-cli containerd

# 启动docker, 开机自启动
systemctl start docker
systemctl enable docker

# 配置阿里云镜像加速
sudo tee /etc/docker/daemon.json <<-'EOF'
> {
>   "registry-mirrors": ["https://c5vzpjbm.mirror.aliyuncs.com"]
> }
> EOF

# 重启docker
systemctl restart docker
```

# docker 常用命令

```bash
# 查看镜像
docker images

# 查看已启动的容器
docker ps

# 查看全部容器，包括未启动的
dockers ps -a

# 镜像拉取
docker pull nginx

# 镜像删除
docker rmi nginx

# 根据镜像启动容器，为容器设置名称为myNgix，-d是后台启动， -p是端口映射，公网端口88映射到容器内端口80
docker run --name=myNginx -d -p 88:80 nginx

# 关闭容器
docker stop myNginx

# 启动已经关闭的容器
docker start myNginx

# 容器删除
docker rm myNginx

# 删除全部容器,包括未启动的
docker rm -f $(docker ps -aq)

# 进入容器内部
docker exec -it myNginx bash

# 自定义镜像,把容器myNginx打包成镜像myNginx，镜像版本号为v1.0
docker commit -m "自定义镜像" myNginx myNginx:v1.0

# 将镜像存储为tar包，以供跨平台传输，会在当前目录下生成myNginx.tar
docker save -o myNginx.tar myNginx:v1.0

# 加载镜像tar包，生成镜像
docker load -i myNginx.tar

# 登录docker仓库,已下3种方式，第一种直接输入，第二种会在history中显示，第三种通过密码文件登录
1. docker login
2. docker login -u systemcaller -p 3W.docker
3. echo "3W.docker" >dockerPassword.txt
   cat dockerPassword.txt | docker login -u systemcaller --password-stdin

# 登出docker
docker logout

# 将镜像推送到远程仓库，要先登录
1. 先在远程仓库中新建仓库 my_nginx，用户名为systemcaller。，也可以不创建，push的时候会自动创建
2. 给镜像打tag， systemcaller/my_nginx是用户名和仓库名。docker的仓库存储的是一种镜像的多个版本，而不是多种镜像的不同版本。
docker tag myNginx:v1.0 systemcaller/my_nginx:v1.0
3. 推送镜像
docker push systemcaller/my_nginx:v1.0

# 从远程仓库镜像拉取
docker pull systemcaller/my_nginx:v1.0

# 容器内目录或者文件挂载到容器外linux系统中
启动容器的时候加上参数-v，格式为 服务器目录:容器目录:读写权限 ，
ro表示容器内的目录只读，不可在容器内修改挂载后的目录会覆盖容器内的目录，
用多个-v可以同时挂载多个目录
注意挂载文件时，需要文件已经在容器外创建好了，否则会被认为将文件挂载到目录而报错, 相当于启动nginx的时候没有配置文件而报错
docker run --name=myNginx -d -p 88:80 -v /root/nginx/html:/usr/share/nginx/html:ro  -v /root/nginx/conf/nginx.conf:/etc/nginx/nginx.conf nginx

# 查看容器日志
docker logs myNginx

# 容器和系统之间文件复制
docker cp myNginx:/etc/nginx/nginx.conf ./nginx.conf

# 查看全部挂载点
docker volumes list

# 查看挂载详情
docker volumes  inspect <挂载点名称>

# 查看容器详情，可以查看容器的一切信息
docker inspect myNginx

# 查看容器的网络
docker network list
docker volumes inspect <网络名称>
```

## 挂载

Docker 的挂载，指的是将宿主机（运行 Docker 的机器）上的目录或文件挂载到容器中。为什么要挂载？它有以下好处：

- **数据持久化：** 容器是短暂的，如果容器被删除，容器中的数据也会丢失。通过挂载，可以将容器中的数据保存到宿主机上。即使容器删除了，数据也不会丢失。
- **共享数据：** 多个容器可以共享同一个挂载目录，实现数据共享。

挂载需要注意的点，都是我踩过的坑。

- **权限：** 确保容器内的进程有足够的权限访问挂载的目录。比如写数据的权限。
- **数据一致性：** 在多个容器共享数据卷时，需要注意数据一致性问题。
- **数据备份：** 对于重要的数据，建议定期备份。
- **挂载文件：** 必须先在容器外创建好文件，否则认为文件挂载到目录而报错。
- **挂载路径：** 使用绝对路径必须以根路径为开始，即 /xxx/xxx。不以根路径为开始的挂载都视为相对路径，默认被挂载到了 /var/lib/docker/volumes 相对目录下。官方定义里相对路径的挂载叫做数据卷，在多容器的时候管理起来方便些。

# 使用示例

## docker 启动 redis 容器

redis 启动是依赖 `/etc/redis/redis.conf` 这个配置文件的，我希望将这个文件通过挂载映射到宿主机上，避免修改配置的时候还要进入容器里面修改。下面是启动示例：

```bash
docker run -p 6379:6379 \\
-v /root/redis/data:/data \\
-v /root/redis/conf/redis.conf:/etc/redis/redis.conf \\
-d --name my_redis redis \\
redis-server /etc/redis/redis.conf
```

命令解析：

- **`-p 6379:6379`:** 将容器的 6379 端口映射到主机的 6379 端口。
- **`-v /root/redis/data:/data`:** 将宿主机上的 `/root/redis/data` 目录挂载到容器内的 `/data` 目录。是挂载 redis 持久化数据.
- **`-v /root/redis/conf/redis.conf:/etc/redis/redis.conf`:** 是挂载配置文件，需要先在容器外创建 redis.conf 文件
- **`-d --name my_redis`:** 以守护进程方式运行容器，并命名为 `my_redis`。
- **`redis`:** 使用 `redis` 镜像。
- **`redis-server /etc/redis/redis.conf`:** 指定容器启动时运行的命令，即启动 Redis 服务器并加载配置文件。

配置文件内容如下：

```bash
root@47017f6fd5a5:/data# cat /root/redis/conf/redis.conf
appendonly yes #持久化
requirepass 123456 #密码
```
