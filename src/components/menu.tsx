import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import React, { useState } from "react";

interface MenuItem {
  id: string;
  text: string;
  subItems?: MenuItem[];
}

const reorder = (
  list: MenuItem[],
  startIndex: number,
  endIndex: number
): MenuItem[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: "1", text: "Item 1" },
    {
      id: "2",
      text: "Item 2",
      subItems: [
        { id: "2.1", text: "Subitem 2.1" },
        { id: "2.2", text: "Subitem 2.2" },
        { id: "2.3", text: "Subitem 2.3" },
      ],
    },
    { id: "3", text: "Item 3" },
  ]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      menuItems,
      result.source.index,
      result.destination.index
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
                    {provided.placeholder}
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
