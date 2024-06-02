import dbConnect from "@/lib/db";
import messageModle from "@/model/Message";

export async function POST(request) {
  await dbConnect();
  const { userId, title, todoId, description, isCompleted } =
    await request.json();

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

    const updateTodo = await messageModle.findByIdAndUpdate(
      todoId,
      {
        title: title,
        description: description,
        isCompleted: isCompleted,
      },
      { new: true }
    );

    if (!updateTodo) {
      return Response.json(
        {
          success: false,
          message: "Error while updating todo",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Todo updated successfully",
        updateTodo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while updating todo", error);
    return Response.json(
      {
        message: "Errow while updating todo",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
