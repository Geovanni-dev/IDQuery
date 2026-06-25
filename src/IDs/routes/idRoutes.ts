import { Router } from 'express'; // importação da rota do express
import { idController } from '../controller/idController.js'; // importação do controller
import { rateLimitMiddleware } from '../../middlewares/rateLimit.js'; // importação do middleware rateLimit

const router = Router(); // criação da rota

//=================== rotas
// rota para buscar o id
router.get('/:id', rateLimitMiddleware.middleware(), idController.showId);

//rota para adicionar o id
router.post('/add', idController.storeId);

//rota para deletar o id
router.delete('/:id', idController.destroyId);

//rota para adicionar ids em massa
router.post('/bulk', idController.storeIds);

export const idRoutes = router;
