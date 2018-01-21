//defines what properties each object has,
//and exactly how each object is related to each other

//schema is probably 50% of all the graphql work
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphql;
const axios = require('axios');

//hardcode users:
const users = [
  {id: '23', firstName: 'Bill', age: 21},
  {id: '47', firstName: 'Samantha', age: 21}
]

//graphql will instruct the presence of a user:
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {type: GraphQLString},
    firstName: {type: GraphQLString},
    age: {type: GraphQLInt}
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {id: {type: GraphQLString}},
      //parentValue is notorious for not being used almost ever
      resolve(parentValue, args) {
          //very important function in GraphQL
          //"oh, we're looking for user with id 23"
          //this function wants to return a user

          //`` is an ES6 template string
          //and this is where we connect to the database server:
          return axios.get(`http://localhost:3000/users/${args.id}`)
          //graphql is going to wait for the promise to the request to resolve. then take it down to query
          //.then(response => console.log(response)) // {data: {firstName: 'bill'}}
          .then(resp => resp.data);
          //so that the next .then(data => data) only gets the data back
      }
    }
  }
});

//make it available
module.exports = new GraphQLSchema({
  query: RootQuery
});
