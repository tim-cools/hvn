import unittest

from parse_tree_sequence import parse_tree_sequence


class TestParsing(unittest.TestCase):

    def test_parse_sequence_with_2_levels(self):
        tree = parse_tree_sequence(":root|+|root1:root|+|child11|child12|-|root2|+|child21|child22|-|-")
        self.assertIsNotNone(tree)
        self.assertIsNotNone(tree[""]["root1"])
        self.assertIsNotNone(tree[""]["root1"]["child11"])
        self.assertIsNotNone(tree[""]["root1"]["child12"])
        self.assertIsNotNone(tree[""]["root2"])
        self.assertIsNotNone(tree[""]["root2"]["child21"])
        self.assertIsNotNone(tree[""]["root2"]["child22"])

    def test_parse_sequence_with_3_levels(self):
        tree = parse_tree_sequence(":root|+|root1|+|child11|child12|+|child121|child122|+|child1221|child1222|-|-|-|root2|+|child21|child22|-|-")
        self.assertIsNotNone(tree)
        self.assertEqual(tree[""]["___type"], "root")
        self.assertIsNotNone(tree[""]["root1"])
        self.assertIsNotNone(tree[""]["root1"]["child11"])
        self.assertIsNotNone(tree[""]["root1"]["child12"])
        self.assertIsNotNone(tree[""]["root1"]["child12"]["child121"])
        self.assertIsNotNone(tree[""]["root1"]["child12"]["child122"])
        self.assertIsNotNone(tree[""]["root1"]["child12"]["child122"]["child1221"])
        self.assertIsNotNone(tree[""]["root1"]["child12"]["child122"]["child1222"])
        self.assertIsNotNone(tree[""]["root2"])
        self.assertIsNotNone(tree[""]["root2"]["child21"])
        self.assertIsNotNone(tree[""]["root2"]["child22"])

if __name__ == '__main__':
    unittest.main()