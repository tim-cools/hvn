def parse_tree_sequence(sequence):
    
    parts = sequence.split("|")
    object_stack = []
    current_object = {}
    last_object = current_object

    for part in parts:

        node_parts = part.split(":")
        name = node_parts[0]
        if len(node_parts) > 1:
            node_type = node_parts[1]
        else:
            node_type = ""

        if name == "+":
            object_stack.append(current_object)
            current_object = last_object
        elif name == "-":
            if len(object_stack) == 0:
                raise Exception("Invalid token '-', sequence is incomplete: " + sequence)

            current_object = object_stack.pop()
            last_object = current_object
        else:
            last_object = {"___type": node_type,}
            current_object[name] = last_object

    if len(object_stack) == 1:
        raise Exception("Invalid sequence, not closed: " + sequence)

    return current_object