#!/bin/bash
mongos --configdb configReplSet/configsvr:27017 --bind_ip_all --port 27020 &

until mongosh --port 27020 --eval "db.adminCommand(\"ping\")" >/dev/null 2>&1; do
  echo "Waiting for mongos server to start..."
  sleep 1
done

mongosh --port 27020 --eval "
db.getSiblingDB('admin').createUser({
  user: 'root',
  pwd: 'root',
  roles: ['root']
});

sh.addShard(\"shard1ReplSet/shard1:27018\");
sh.addShard(\"shard2ReplSet/shard2:27019\");

sh.enableSharding(\"messenger\");
sh.shardCollection(\"messenger.user\", { \"username\": \"hashed\" });
sh.shardCollection(\"messenger.jwt\", { \"username\": \"hashed\" });
sh.shardCollection(\"messenger.chatRoom\", { \"chatId\": \"hashed\" });
sh.shardCollection(\"messenger.chatMessage\", { \"chatId\": \"hashed\" });
"
echo "Mongos server initialization complete!"
tail -f /dev/null
