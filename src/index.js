const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const resolvers = {
  Query: {
    car(parent, { carId }, ctx, info) {
      return ctx.db.query.car({ where: { id: carId } }, info)
    },
    carByManufacturer(parent, { manufacturerId }, ctx, info) {
      return ctx.db.query.cars({
        where: { 
          manufacturer: { id: manufacturerId },
        },
        info
      })
    },
    cars(parent, args, ctx, info) {
      return ctx.db.query.cars({}, info)
    },
    carsForUser(parent, { userId }, ctx, info) {
      return ctx.db.query.cars({
        where: { 
          user: { id: userId },
        },
        info
      })
    },
    manufacturer(parent, { manufacturerId }, ctx, info) {
      return ctx.db.query.manufacturer({ where: { id: manufacturerId } }, info)
    },
    manufacturers(parent, args, ctx, info) {
      return ctx.db.query.manufacturers({}, info)
    },
    user(parent, { userId }, ctx, info) {
      return ctx.db.query.user({ where: { id: userId } }, info)
    },
    users(parent, args, ctx, info) {
      return ctx.db.query.users({}, info)
    },
  },
  Mutation: {
    createCar(parent, { manufacturerId, status, userId }, ctx, info) {
      return ctx.db.mutation.createCar(
        {
          data: {
            manufacturer: { connect: { id: manufacturerId } },
            status,
            user: { connect: { id: userId } },
          },
        },
        info,
      )
    },
    createManufacturer(parent, args, ctx, info) {
      return ctx.db.mutation.createManufacturer(
        {
          data: {},
        },
        info,
      )
    },
    createUser(parent, args, ctx, info) {
      return ctx.db.mutation.createUser(
        {
          data: {},
        },
        info,
      )
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql', // the auto-generated GraphQL schema of the Prisma API
      endpoint: 'https://us1.prisma.sh/public-cottonscarer-305/graphql-nested-issue/dev', // the endpoint of the Prisma API
      debug: true, // log all GraphQL queries & mutations sent to the Prisma API
      // secret: 'mysecret123', // only needed if specified in `database/prisma.yml`
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
