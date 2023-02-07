import { remultNext } from "remult/remult-next";
import { Task } from "../../shared/Task";
import { TasksController } from "../../shared/TasksController";
import { getUserFromNextAuth } from "./auth/[...nextauth]";
import { createPostgresConnection } from "remult/postgres";
import ably from "ably";
import { AblySubscriptionServer } from "remult/live-query/ably";
import { DataProviderLiveQueryStorage } from "remult/live-query/data-provider-live-query-storage";

const dataProvider = createPostgresConnection();

export default remultNext({
  controllers: [TasksController],
  entities: [Task],
  getUser: getUserFromNextAuth,
  dataProvider,
  // subscriptionServer: new AblySubscriptionServer(
  //   new ably.Realtime.Promise(process.env["ABLY_API_KEY"]!)
  // ),
  // liveQueryStorage: new DataProviderLiveQueryStorage(dataProvider),
});
