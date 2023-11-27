import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { FC, useState } from "react";

import { MENU_ITENS } from "./consts";
import { MenuItem } from "./types";

const reorder = (
  list: MenuItem[],
  startIndex: number,
  endIndex: number,
  droppableId?: string
): MenuItem[] => {
  const result = Array.from(list);

  const isSubmenu = droppableId !== "menu";

  if (isSubmenu) {
    const parentIndex = result.findIndex((item) => item.id === droppableId);

    if (parentIndex !== -1) {
      const [parent] = result.splice(parentIndex, 1);
      parent.subItems = parent.subItems || [];
      const [removed] = parent.subItems.splice(startIndex, 1);
      parent.subItems.splice(endIndex, 0, removed);
      result.splice(parentIndex, 0, parent);
    }
  } else {
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  }

  return result;
};

const Menu: FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITENS);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      menuItems,
      result.source.index,
      result.destination.index,
      result.destination.droppableId
    );

    setMenuItems(items);
  };

  const renderMenuItem = (item: MenuItem, index: number) => {
    return (
      <Draggable key={item.id} draggableId={item.id} index={index}>
        {(provided) => (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="border p-2 m-2"
          >
            {item.text}
            {item.subItems && (
              <Droppable droppableId={item.id} type="SUBMENU">
                {(provided) => (
                  <ul ref={provided.innerRef} {...provided.droppableProps}>
                    {item?.subItems?.map((subItem, subIndex) => (
                      <Draggable
                        key={subItem.id}
                        draggableId={subItem.id}
                        index={subIndex}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="border p-2 m-2 bg-gray-100"
                          >
                            {subItem.text}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    <div className="bg-red-500">{provided.placeholder}</div>
                  </ul>
                )}
              </Droppable>
            )}
          </li>
        )}
      </Draggable>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="menu" type="MENU">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {menuItems.map((item, index) => renderMenuItem(item, index))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Menu;
