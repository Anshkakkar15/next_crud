import dbConnect from "@/lib/db";
import messageModle from "@/model/Message";

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const todoId = searchParams.get("todoId");
    if (!userId) {
      return Response.json(
        {
          message: "Session expired please login again",
          success: false,
        },
        {
          status: 404,
        }
      );
    }

    if (!todoId) {
      return Response.json(
        {
          message: "Todo Not Found",
          success: false,
        },
        {
          status: 404,
        }
      );
    }

    const findAllTodos = await messageModle.findById({ _id: todoId }).exec();

    return Response.json(
      {
        data: findAllTodos,
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error while fetching todo", error);
    return Response.json(
      {
        message: "Errow while fetching todo",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
