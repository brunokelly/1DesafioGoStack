const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function FindRepoIndex(value) {

  const RepoIndex = repositories.findIndex(repo => repo.value === value)

  return RepoIndex
}

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title ? repositories.filter(repository => repository.title.includes(title)) : repositories ;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { 
    id: uuid(),
    title, 
    url, 
    techs,
    likes: 0
  }

  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body

  const RepoIndex = repositories.findIndex(repo => repo.id === id)

  if ( RepoIndex < 0) {
      return response.status(400).json({error: 'Project not found'})
  }

  const RepoUpdate = {
    id,
    title, 
    url,
    techs,
    likes: repositories[RepoIndex].likes
  }

  repositories[RepoIndex] = RepoUpdate;

  return response.json(RepoUpdate);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

    const RepoIndex = repositories.findIndex(repo => repo.id === id)

    if ( RepoIndex < 0) {
        return response.status(400).json({error: 'Project not found'})
    }

    repositories.splice(RepoIndex, 1)

    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const RepoIndex = repositories.findIndex(repo => repo.id === id)

  if ( RepoIndex < 0) {
      return response.status(400).json({error: 'Project not found'})
  }

  repositories[RepoIndex].likes++;

  return response.json(repositories[RepoIndex])
});

module.exports = app;
