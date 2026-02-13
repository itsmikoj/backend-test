type ProfileInput = {
  id: string;
  body: {
    full_name: string;
  };
};

export function mapToProfileEntity({ id, body }: ProfileInput) {
  return {
    id: id,
    full_name: body.full_name,
    is_premium: true,
  };
}
