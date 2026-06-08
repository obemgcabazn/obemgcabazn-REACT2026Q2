import type { FormResult } from '../Store/Store';

type Props = {
  item: FormResult;
  isNew: boolean;
};

export default function ResultCard({ item, isNew }: Props) {
  return (
    <li className={`result-card${isNew ? ' result-new' : ''}`}>
      <div>
        <strong>Name:</strong> {item.name}
      </div>
      <div>
        <strong>Age:</strong> {item.age}
      </div>
      <div>
        <strong>Email:</strong> {item.email}
      </div>
      <div>
        <strong>Country:</strong> {item.country}
      </div>
      {item.gender && (
        <div>
          <strong>Gender:</strong> {item.gender}
        </div>
      )}
      <div>
        <strong>Privacy:</strong> {item.privacy ? 'Agreed' : 'Not agreed'}
      </div>
      {item.image && <img src={item.image} alt="uploaded" />}
    </li>
  );
}
