import { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom';

import answerImg from '../../assets/images/answer.svg';
import checkImg from '../../assets/images/check.svg';
import deleteImg from '../../assets/images/delete.svg';
import emptyQuestionsImg from '../../assets/images/empty-questions.svg';
import logoImg from '../../assets/images/logo.svg';

import { Button } from '../../components/button';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/roomCode';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';

import { ModalComponent } from '../../components/Modal';
import '../room/styles.scss';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const [endRoomModalOpen, setEndRoomModalOpen] = useState(false);

  const [questionIdModalOpen, setQuestionIdModalOpen] = useState<
    string | undefined
  >();

  const { title, questions } = useRoom(roomId);

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }
  async function handleHighlightedQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  function handleEndModalClose() {
    setEndRoomModalOpen(false);
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={() => setEndRoomModalOpen(true)}>
              Encerrar sala
            </Button>
            <ModalComponent
              roomId={roomId}
              endModalIsOpen={endRoomModalOpen}
              endModalClose={handleEndModalClose}
            />
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>
            Sala: <span>{title}</span>
          </h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        {questions.length > 0 ? (
          <div className="question-list">
            {questions.map((question) => {
              return (
                <Fragment key={question.id}>
                  <Question
                    content={question.content}
                    author={question.author}
                    isAnswered={question.isAnswered}
                    isHighlighted={question.isHighlighted}
                  >
                    {!question.isAnswered && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            handleCheckQuestionAsAnswered(question.id)
                          }
                        >
                          <img
                            src={checkImg}
                            alt="Marcar pergunta como respondida"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleHighlightedQuestion(question.id)}
                        >
                          <img src={answerImg} alt=" Dar destaque à pergunta" />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => setQuestionIdModalOpen(question.id)}
                    >
                      <img src={deleteImg} alt="Remover pergunta" />
                    </button>
                  </Question>
                  <ModalComponent
                    modalType
                    roomId={roomId}
                    questionIdModalOpen={questionIdModalOpen}
                    questionId={question.id}
                    setQuestionIdModalOpen={setQuestionIdModalOpen}
                  />
                </Fragment>
              );
            })}
          </div>
        ) : (
          <div className="empty-questions admin-style">
            <img src={emptyQuestionsImg} alt="Não há nenhuma pergunta" />
            <p>Nenhuma pergunta por aqui...</p>
            <span>
              Envie o código desta sala para seus amigos e comece a responder
              perguntas!
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
