This repo demonstrates an issue where nested subfields are not returned for certain queries to the GraphQL server.

# Start

`prisma deploy`

`npm start`

# Queries

Use the GraphQL playground to query and mutate.

The database should be seeded with a single `manufacturer` and a single `user`. Check by querying 

```
query {
  manufacturers {
    id
  }
}
```

```
query {
  users {
    id
  }
}
```

Grab the `manufacturer` id and `user` id for a mutation, adding a `car`

```
mutation {
  createCar(
    manufacturerId: "<manufacturerId>",
    status: "active",
    userId: "<userId>"
  ) {
    id
  }
}
```

## Query to verify data (query succeeds)

Now, query for all `cars`. The recently created `car` should appear in the list, with all nested subfields returned appropriately.

```
query {
  cars {
    id
    manufacturer {
      id
    }
    status
    user{
      id
    }
  }
}
```

The result should look something like this (note the subfields are returned correctly):

```
{
  "data": {
    "cars": [
      {
        "id": "cjidqcvmx4rkx0b73tugjbzv1",
        "manufacturer": {
          "id": "cjidq9no94rda0b73u8nsrcfr"
        },
        "status": "active",
        "user": {
          "id": "cjidq9g484rcq0b73frb2l6hv"
        }
      }
    ]
  }
}
```

## Query for cars with a certain user relation (this query returns an incomplete result)

Now, query for `cars` for the `user` id.

```
query {
  carsForUser(userId: "<userId>") {
    id
    manufacturer {
      id
    }
    status
    user{
      id
    }
  }
}
```

The result returns `null` for both `manufacturer` and `user`. Somehow these fields were swallowed by the query.

```
{
  "data": {
    "carsForUser": [
      {
        "id": "cjidqcvmx4rkx0b73tugjbzv1",
        "manufacturer": null,
        "status": "active",
        "user": null
      }
    ]
  }
}
```
