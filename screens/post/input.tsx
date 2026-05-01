//post input.tsx
import { Post } from '@/lib/type'
import { Text } from '@/components/ui/text'
import { TextInput } from 'react-native'
//hastag post related screen

export type RendertextOptions = {
  onMentionPress?: (usernameWithoutAt: string) => void;
};

export const rendertext = (textArray: string[], options?: RendertextOptions) => {
  if (!textArray) return null;
  const onMention = options?.onMentionPress;
  return (
    <Text className=" my-2">
      {textArray?.map((part, index) => {
        if (part?.startsWith('#')) {
          const tag = part?.toLowerCase();
          return (
            <Text style={{ color: '#90d5ff', fontSize: 12 }} size="md" key={index} className="font-bold">
              {tag}
            </Text>
          );
        }
        if (part?.startsWith('@')) {
          const display = part?.toLowerCase();
          const slug = part.slice(1);
          if (onMention) {
            return (
              <Text
                key={index}
                onPress={() => onMention(slug)}
                style={{ color: '#90d5ff', fontSize: 12 }}
                size="md"
                className="font-bold"
              >
                {display}
              </Text>
            );
          }
          return (
            <Text style={{ color: '#90d5ff', fontSize: 12 }} size="md" key={index} className="font-bold">
              {display}
            </Text>
          );
        }
        return (
          <Text style={{ color: 'white' }} size="md" key={index}>
            {part}
          </Text>
        );
      })}
    </Text>
  );
};



export default ({ post, updatePost, textArray }: { post: Post, updatePost: (id: string, key: string, value: string) => void, textArray: string[] }) => {
    return (
        <TextInput

            multiline={true}
            onChangeText={(text) => updatePost(post.id, "text", text)}
            className="text-md"
            placeholderTextColor="grey"

            placeholder="What's new?"

            style={{ color: 'white' }}
        >
            {rendertext(textArray)}
        </TextInput>


    )

}