---
title: Linux系统添加新硬盘
publishDate: 2020-11-18
description: 大部分Linux系统不会安装图形界面，因此添加硬盘只能使用命令行操作。
tags:
  - linux
---

**本文所有操作都需要root来执行**

## 检查硬盘

插上新硬盘或是在云服务器上购买新硬盘后，首先查看新硬盘是否被识别：`fdisk -l`（xxx也可以）

```
[root@VM-0-11-centos ljx]# sudo fdisk -l

Disk /dev/vda: 53.7 GB, 53687091200 bytes, 104857600 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 262144 bytes / 262144 bytes
Disk label type: dos
Disk identifier: 0x0009ac89

   Device Boot      Start         End      Blocks   Id  System
/dev/vda1   *        2048   104857566    52427759+  83  Linux

Disk /dev/vdb: 107.4 GB, 107374182400 bytes, 209715200 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 262144 bytes / 262144 bytes
```

可以看到有块新硬盘/dev/vdb，但是没有分区，因此接下来先给该硬盘分区。

## 硬盘分区

分区命令为：`fdisk /dev/vdb`，其中/dev/vdb是上一步中看到的硬盘名称。该命令为交互式的脚本，命令步骤如下：

1. n：代表新建分区
2. p：表示新建的分区为主分区
3. 回车：即分区编号使用默认的1
4. 回车：即第一个扇区使用默认的2048
5. 回车：即最后一个扇区使用默认的209715199
6. w：保存

完整命令如下：

```
[root@VM-0-11-centos ljx]# fdisk /dev/vdb
Welcome to fdisk (util-linux 2.23.2).

Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Device does not contain a recognized partition table
Building a new DOS disklabel with disk identifier 0x77d3e73d.

Command (m for help): n
Partition type:
   p   primary (0 primary, 0 extended, 4 free)
   e   extended
Select (default p): p
Partition number (1-4, default 1):
First sector (2048-209715199, default 2048):
Using default value 2048
Last sector, +sectors or +size{K,M,G} (2048-209715199, default 209715199):
Using default value 209715199
Partition 1 of type Linux and of size 100 GiB is set

Command (m for help): w
The partition table has been altered!

Calling ioctl() to re-read partition table.
Syncing disks.
```

## 格式化

分区好之后，再次使用`fdisk -l`命令可以看到，新分区为/dev/vdb1。使用分区命令：` mkfs.xfs -f /dev/vdb1`将该分区格式化为xfs磁盘格式。

```
meta-data=/dev/vdb1              isize=512    agcount=16, agsize=1638384 blks
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=1        finobt=0, sparse=0
data     =                       bsize=4096   blocks=26214144, imaxpct=25
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0 ftype=1
log      =internal log           bsize=4096   blocks=12799, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0
```

## 挂载分区

挂载分为两种，一种是立即挂载，挂载后马上就可以使用，但是重启后失效。另一种是启动挂载，即在系统启动时自动挂载。

### 立即挂载

使用命令：`mount -t xfs /dev/vdb1 /data`将该分区挂载到/data目录（目录必须存在），然后使用df -h即可看到已挂载成功。

```
[ljx@VM-0-11-centos download]$ df -h
Filesystem      Size  Used Avail Use% Mounted on
devtmpfs        1.9G     0  1.9G   0% /dev
tmpfs           1.9G   24K  1.9G   1% /dev/shm
tmpfs           1.9G  608K  1.9G   1% /run
tmpfs           1.9G     0  1.9G   0% /sys/fs/cgroup
/dev/vda1        50G  3.7G   44G   8% /
tmpfs           379M     0  379M   0% /run/user/0
tmpfs           379M     0  379M   0% /run/user/1000
/dev/vdb1       100G   33M  100G   1% /data
```

### 启动挂载

编辑文件：`vi /etc/fstab`，在末尾加入

```
/dev/vdb1 /data xfs defaults 0 0
```

操作系统就会在启动时自动将/dev/vdb1挂载到/data，0 0代表挂载时不检查硬盘分区。
