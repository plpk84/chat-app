#!/bin/bash

mongod --shardsvr --replSet shard2ReplSet --port 27019 --bind_ip_all &

until mongosh --port 27019 --eval "db.adminCommand(\"ping\")" >/dev/null 2>&1; do
  echo "Waiting for shard server to start..."
  sleep 1
done

mongosh --port 27019 --eval "
rs.initiate({
  _id: \"shard2ReplSet\",
  members: [{ _id: 0, host: \"shard2:27019\" }]
})
"
echo "Shard2 initialization complete!"
tail -f /dev/null
