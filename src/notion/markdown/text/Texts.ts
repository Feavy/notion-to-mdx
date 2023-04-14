import Text from "./Text";
import MentionText from "./MentionText";
import {NotionRichText} from "../../types/NotionTypes";

type TextConstructor<T extends Text, B extends NotionRichText> = new (block: B) => T;

export default class Texts {
  private static readonly converters = new Map<string, TextConstructor<any, any>>();

  static {
    Texts.register("mention", MentionText);
  }

  private static register(type: string, text: TextConstructor<any, any>) {
    Texts.converters.set(type, text);
  }

  public static create(text: NotionRichText): Text {
    const ctor = Texts.converters.get(text.type);
    if (!ctor) {
      return new Text(text);
    }
    return new ctor(text);
  }

}