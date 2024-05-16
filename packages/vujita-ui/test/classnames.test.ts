import classnames from "vujita-ui/src/classnames";

describe("classnames", () => {
  it("should join classnames", () => {
    expect(classnames("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
  });
});
