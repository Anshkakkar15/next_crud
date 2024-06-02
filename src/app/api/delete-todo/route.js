import dbConnect from "@/lib/db";
import messageModle from "@/model/Message";

export async function POST(request) {
  await dbConnect();
  const { userId, todoId } = await request.json();

  try {
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

    const deletedTodo = await messageModle.findByIdAndDelete({ _id: todoId });

    if (!deletedTodo) {
      return Response.json(
        {
          success: false,
          message: "Error while deleting todo",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Todo deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while deleting todo", error);
    return Response.json(
      {
        message: "Errow while deleting todo",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
