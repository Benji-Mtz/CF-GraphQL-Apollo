// const { ApolloServer } = require ('@apollo/server');
// const { startStandaloneServer } = require ('@apollo/server/standalone');

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import courses from './courses.js';

const typeDefs = `
    type Course {
        id:  ID!
        title: String!
        views: Int
    }

    type Alert {
        message: String
    }

    input CourseInput {
        title: String!
        views: Int
    }

    type Query {
        getCourses(page: Int, limit: Int = 1): [Course]
        getCourse(id: ID!): Course
    }

    type Mutation {
        addCourse(input: CourseInput): Course
        updateCourse(id: ID!, input: CourseInput): Course
        deleteCourse(id: ID!): Alert
    }
`;

const resolvers = {
    Query: {
        getCourses(parent, { page, limit } ) {
            if (page !== undefined) {
                return courses.slice(page * limit, (page + 1) * limit);
            }
            return courses;
        },
        getCourse(parent, { id }){
            // console.log(id);
            const course = courses.find( (course) => course.id == id)
            return course;
        },
    },
    Mutation: {
        addCourse(parent, { input } ){
            const { title, views } = input;

            const id = String(courses.length + 1);
            const course = { id, title, views };
            courses.push(course);
            return course;
        },
        updateCourse(parent, { id, input }){
            const { title, views } = input;
            
            const courseIndex = courses.findIndex( (course) => course.id == id );
            const course = courses[courseIndex];
    
            // const newCourse = Object.assign(course, input);
            const newCourse = {
                ...course,
                title, 
                views
            }
    
            courses[courseIndex] = newCourse;
            return newCourse;
    
        },
        deleteCourse(parent, { id }){
            courses = courses.filter( (course) => course.id != id );
            return {
                message: `El curso con el id: ${ id } fue eliminado`
            }
        }
    }
  };

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
  
console.log(`🚀  Server ready at: ${url}`);