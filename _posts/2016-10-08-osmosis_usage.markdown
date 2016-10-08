---
layout: post
title:  "OSM数据处理的瑞士军刀"
date:   2016-10-08 19:51:42
categories: osmosis osm
---

Osmosis 是一个用Java开发的命令行工具，用来处理 OpenStreetMap 的地图数据。

pbf转成xml

`osmosis --read-pbf beijing.pbf --write-xml beijing.osm`

只导出餐馆

`osmosis --read-xml input.osm --tf accept-nodes amenity=restaurant --write-xml output-nodes.osm`

只导出道路

`osmosis --read-xml city.osm --tf accept-ways highway=* --used-node --write-xml highways.osm`

只导某个范围的数据

`osmosis --read-xml file=beijing.osm --bounding-box top=40.6306 left=115.5322 bottom=39.4871 right=117.4164 --write-xml file=beijing_out.osm`

生成osmchange文件

`osmosis --read-xml file="planet1.osm" --read-xml file="planet2.osm" --derive-change --write-xml-change file="planetdiff-1-2.osc"`

`osmosis --read-xml file="planet1.osm" --read-apidb host="x" database="x" user="x" password="x" --derive-change --write-xml-change file="planetdiff-1-2.osc"`

`osmosis --read-apidb-change host="x" database="x" user="x" password="x" validateSchemaVersion="no" intervalBegin="2016-09-27_00:00:00" --write-xml-change file="planetdiff-1-2.osc"`

使用osmchange更新

`osmosis --read-xml-change file="planetdiff-1-2.osc" --read-xml file="planet1.osm" --apply-change --write-xml file="planet2.osm"`

清空数据库

`osmosis --truncate-apidb host="x" database="x" user="x" password="x" validateSchemaVersion="no"`

导入数据库

`osmosis --read-pbf file=beijing.pbf --write-apidb host="x" database="x" user="x" password="x" validateSchemaVersion="no"`

数据库导出

`osmosis --read-apidb host="x" database="x" user="x" password="x" --write-pbf file=beijing.pbf`

生成replicate数据

```
mkdir replicate
cd replicate
osmosis --replicate-apidb host="x" database="x" user="x" password="x" validateSchemaVersion="no" iterations=0 minInterval=60000 --write-replication
```

iterations是执行次数，0是无限循环，minInterval是间隔时间，单位是毫秒。

然后把replicate目录发布成http服务，这样就实现了http://planet.openstreetmap.org/replication/minute/


使用replicate数据更新

初始化更新配置

```
mkdir WORKDIR
cd WORKDIR
osmosis --read-replication-interval-init
```

这里会生成configuration.txt文件，修改其中的BaseURL

baseUrl=http://download.geofabrik.de/asia/china-updates/

下载当天的state.txt

wget http://download.geofabrik.de/asia/china-updates/state.txt

以后每天执行更新

```
osmosis --read-replication-interval --simplify-change --write-xml-change changes.osc.gz
osm2pgsql --append --slim -C 100 --number-processes 1 changes.osc.gz
```

详细说明见http://wiki.openstreetmap.org/wiki/Osmosis#Example_usage
