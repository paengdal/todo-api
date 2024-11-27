import mongoose from "mongoose";
import express from "express";
import Task from "./models/task.js";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to DB"));

const app = express();

// const corsOptions = {
//   origin: ["http://127.0.0.1:5500", "https://my-todo.com"],
// };
// app.use(cors(corsOptions));
// 특정 주소에 대해서만 cors 허용. 이게 더 안전함

app.use(cors());
app.use(express.json());
// 앱 전체에서 express.json()을 사용하겠다는 의미
// req의 content-type이 application/json이면 이를 parsing해서 req body에 js객체로 담아줌)

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: e.message });
      } else if (e.name === "CastError") {
        res.status(404).send({ message: "Cannot find given id." });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

app.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    /**
     * - sort: 'oldest'인 경우 오래된 태스크 기준, 나머지 경우 새로운 태스크 기준
     * - count: 태스크 개수
     */
    const sort = req.query.sort;
    const count = Number(req.query.count) || 0; // count 파라미터가 없거나 숫자가 아닌 경우 0

    const sortOption = { createdAt: sort === "oldest" ? "asc" : "desc" };

    const tasks = await Task.find().sort(sortOption).limit(count);

    res.send(tasks);
  })
);

app.get(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (task) {
      res.send(task);
    } else {
      res.status(404).send({ message: "Cannot find given id. " });
    }
  })
);

app.post(
  "/tasks",
  asyncHandler(async (req, res) => {
    const newTask = await Task.create(req.body);

    mockTasks.push(newTask);
    res.status(201).send(newTask);
  })
);

app.patch(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (task) {
      const reqKeys = Object.keys(req.body);
      reqKeys.forEach((key) => {
        task[key] = req.body[key];
      });
      await task.save();
      res.status(201).send(task);
    } else {
      res.status(404).send({ message: "Cannot find given id. " });
    }
  })
);

app.delete(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id);
    if (task) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: "Cannot find given id. " });
    }
  })
);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
