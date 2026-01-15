def parse_tree_sequence(sequence):
    
    parts = sequence.split("|")
    object_stack = []
    current_object = {}
    last_object = {}

    for part in parts:

        node_parts = part.split(":")
        name = node_parts[0]

        if len(node_parts) > 1:
            type_part = node_parts[1]
            node_type = type_part[:-1] if type_part.endswith("-") else type_part
            children_not_loaded = True if type_part.endswith("-") else False
        else:
            node_type = None
            children_not_loaded = None

        if name == "+":
            object_stack.append(current_object)
            current_object = last_object
        elif name == "-":
            if len(object_stack) == 0:
                raise Exception("Invalid token '-', sequence is incomplete: " + sequence)

            current_object = object_stack.pop()
            last_object = current_object
        else:
            if node_type is not None:
                if children_not_loaded:
                    last_object = {"___type": node_type, "___childrenNotLoaded": children_not_loaded}
                else:
                    last_object = {"___type": node_type}

            current_object[name] = last_object

    if len(object_stack) == 1:
        raise Exception("Invalid sequence, not closed: " + sequence)

    return current_object