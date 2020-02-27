import * as React from "react";
import * as renderer from "react-test-renderer";
import Hello from "..";

test("Component should show 'red' text 'Hello World'", () => {
  const component = renderer.create(<Hello text="World" />);
  const testInstance = component.root;

  expect(testInstance.findByType(Hello).props.text).toBe("World");

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});