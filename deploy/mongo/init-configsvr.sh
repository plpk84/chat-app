#!/bin/bash
mongod --configsvr --replSet configReplSet --port 27017 --bind_ip_all &

until mongosh --port 27017 --eval "db.adminCommand(\"ping\")" >/dev/null 2>&1; do
  echo "Waiting for MongoDB to start..."
  sleep 1
done

mongosh --port 27017 --eval "
rs.initiate({
_id: \"configReplSet\",
configsvr: true,
members: [{ _id: 0, host: \"configsvr:27017\" }]
})
"
echo "Config server initialization complete!"
tail -f /dev/null
