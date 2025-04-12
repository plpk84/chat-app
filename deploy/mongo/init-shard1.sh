#!/bin/bash

mongod --shardsvr --replSet shard1ReplSet --port 27018 --bind_ip_all &

until mongosh --port 27018 --eval "db.adminCommand(\"ping\")" >/dev/null 2>&1; do
  echo "Waiting for shard server to start..."
  sleep 1
done

mongosh --port 27018 --eval "
rs.initiate({
  _id: \"shard1ReplSet\",
  members: [{ _id: 0, host: \"shard1:27018\" }]
})
"
echo "Shard1 initialization complete!"
tail -f /dev/null
