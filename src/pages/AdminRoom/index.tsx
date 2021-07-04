import { useParams, useHistory } from 'react-router-dom';
import { useState } from 'react';
import { Fragment } from 'react';

import logoImg from '../../assets/images/logo.svg';
import emptyQuestionsImg from '../../assets/images/empty-questions.svg'
import deleteImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';
import deleteRoomImg from '../../assets/images/deleteRoom.svg'

import { Button } from '../../components/button';
import { useRoom } from '../../hooks/useRoom';
import { Question } from '../../components/question';
import { RoomCode } from '../../components/roomCode';
import { database } from '../../services/firebase';

// import { useAuth } from '../../hooks/useAuth';
import Modal from 'react-modal';

import '../room/styles.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory()
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const [questionIdModalOpen, setQuestionIdModalOpen] = useState<string | undefined>();
  const [endRoomModalOpen, setEndRoomModalOpen] = useState(false);

  const { title, questions } = useRoom(roomId);

  async function handleConfirmEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),

    })
    history.push('/')
  }

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

  async function handleDeleteQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={() => setEndRoomModalOpen(true)}>Encerrar sala</Button>
            <Modal
              isOpen={endRoomModalOpen}
              onRequestClose={() => setEndRoomModalOpen(false)}
              className="modal"
              overlayClassName="overlay"
            >
              <div className="modal-content">
                <img src={deleteRoomImg} alt="Deletar Sala" />
                <p>Encerrar sala</p>
                <span>Tem certeza que você deseja encerrar esta sala?</span>

                <div>
                  <Button
                    onClick={() => setEndRoomModalOpen(false)}
                    leftModalButton
                  >
                    Cancelar
                  </Button>

                  <Button
                    onClick={handleConfirmEndRoom}
                    rightModalButton
                  >
                    Sim, encerrar
                  </Button>
                </div>

              </div>
            </Modal>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala: <span>{title}</span></h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        {questions.length > 0 ? (
          <div className="question-list">
            {questions.map(question => {
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
                          onClick={() => handleCheckQuestionAsAnswered(question.id)}
                        >
                          <img src={checkImg} alt="Marcar pergunta como respondida" />
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
                  <Modal
                    isOpen={questionIdModalOpen === question.id}
                    onRequestClose={() => setQuestionIdModalOpen(undefined)}
                    className="modal"
                    overlayClassName="overlay"
                  >
                    <div className="modal-content">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 5.99988H5H21" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                      <p>Excluir pergunta</p>
                      <span>Tem certeza que você deseja excluir essa pergunta?</span>

                      <div>
                        <Button
                          onClick={() => setQuestionIdModalOpen(undefined)}
                          leftModalButton
                        >
                          Cancelar
                        </Button>

                        <Button
                          rightModalButton
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          Sim, excluir
                        </Button>
                      </div>
                    </div>
                  </Modal>
                </Fragment>
              );
            })}
          </div>
        ) : (
          <div className="empty-questions admin-style">
            <img src={emptyQuestionsImg} alt="Não há nenhuma pergunta" />
            <p>Nenhuma pergunta por aqui...</p>
            <span>Envie o código desta sala para seus amigos e comece a responder perguntas!</span>
          </div>
        )}
      </main>
    </div>
  );
}